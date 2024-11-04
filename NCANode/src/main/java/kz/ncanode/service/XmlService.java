package kz.ncanode.service;

import kz.ncanode.dto.request.XmlSignRequest;
import kz.ncanode.dto.response.VerificationResponse;
import kz.ncanode.dto.response.XmlSignResponse;
import kz.ncanode.exception.ClientException;
import kz.ncanode.wrapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.traversal.DocumentTraversal;
import org.w3c.dom.traversal.NodeFilter;
import org.w3c.dom.traversal.NodeIterator;

import java.util.*;


/**
 * XML/XMLDSIG Service.
 *
 * Сервис отвечает за всё что связано с XML/XMLDSIG.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class XmlService {
    private final KalkanWrapper kalkanWrapper;
    private final CertificateService certificateService;

    /**
     * Read XML from String
     *
     * @param xml XML-String
     * @param removeSignatures Удалять подписи в XML
     * @return Document Object
     */
    public DocumentWrapper read(String xml, boolean removeSignatures) {
        final DocumentWrapper document = new DocumentWrapper(xml);

        if (removeSignatures) {
            final Element root = document.getDocumentElement();
            final NodeList signatures = root.getElementsByTagName("ds:Signature");

            for (int i=0; i< signatures.getLength(); ++i) {
                root.removeChild(signatures.item(i));
            }
        }

        return document;
    }

    /**
     * Подписывание XML
     *
     * @param xmlSignRequest Запрос на подпись XML
     * @return Ответ с подписанным XML
     */
    public XmlSignResponse sign(XmlSignRequest xmlSignRequest) {
        final DocumentWrapper document = read(xmlSignRequest.getXml(), xmlSignRequest.isClearSignatures());

        if (xmlSignRequest.isTrimXml()) {
            removeWhitespace(document.getDocument());
        }

        int i = 0;

        for (KeyStoreWrapper keyStore : kalkanWrapper.read(xmlSignRequest.getSigners())) {
            document.createXmlSignature(keyStore.getCertificate(), xmlSignRequest.getSigners().get(i++).getReferenceUri())
                .sign(keyStore.getPrivateKey());
        }

        return XmlSignResponse.builder()
            .xml(document.toString())
            .build();
    }

    /**
     * Проверяет XML-подписи
     *
     * @param xml XML-строка
     * @param checkOcsp Проверять в OCSP
     * @param checkCrl Проверять в CRL
     * @return Результат проверки
     */
    public VerificationResponse verify(String xml, boolean checkOcsp, boolean checkCrl) {
        final DocumentWrapper document = read(xml, false);
        final Element root = document.getDocumentElement();
        final NodeList signatures = root.getElementsByTagName("ds:Signature");
        final int signaturesLength = signatures.getLength();

        boolean valid = true;

        final ArrayList<CertificateWrapper> certs = new ArrayList<>();

        final Date currentDate = certificateService.getCurrentDate();

        for (int i = 0; i<signaturesLength; ++i) {
            final Element signature = (Element)signatures.item(signatures.getLength() - 1);

            if (Objects.isNull(signature)) {
                throw new ClientException("Bad signature: Element 'ds:Reference' is not found in XML document");
            }

            final XMLSignatureWrapper xmlSignature = new XMLSignatureWrapper(signature);

            val cert = xmlSignature.getCertificate().orElse(null);

            if (cert == null) {
                valid = false;
                certs.add(null);
                continue;
            }

            certificateService.attachValidationData(cert, checkOcsp, checkCrl);

            if (!xmlSignature.check() || !cert.isValid(currentDate, checkOcsp, checkCrl)) {
                valid = false;
            }
            root.removeChild(signature);

            certs.add(cert);
        }

        if (signaturesLength < 1) {
            valid = false;
        }

        return VerificationResponse.builder()
            .valid(valid)
            .signers(certs.stream().map(c -> c.toCertificateInfo(currentDate, checkOcsp, checkCrl)).toList())
            .build();
    }

    public String prepare(String xml, boolean trimXml) {
        return (trimXml ? removeWhitespace(xml) : xml).trim();
    }

    public void removeWhitespace(Document document) {
        Set<Node> toRemove = new HashSet<>();
        DocumentTraversal t = (DocumentTraversal) document;
        NodeIterator it = t.createNodeIterator(document,
            NodeFilter.SHOW_TEXT, null, true);

        for (org.w3c.dom.Node n = it.nextNode(); n != null; n = it.nextNode()) {
            if (n.getNodeValue().trim().isEmpty()) {
                toRemove.add(n);
            }
        }

        for (org.w3c.dom.Node n : toRemove) {
            n.getParentNode().removeChild(n);
        }
    }

    public String removeWhitespace(String xml) {
        val document = read(xml, false);
        removeWhitespace(document.getDocument());
        return document.toString();
    }
}
