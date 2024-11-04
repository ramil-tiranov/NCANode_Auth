package kz.ncanode.wrapper;

import kz.ncanode.exception.ServerException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.xml.security.encryption.XMLCipherParameters;
import org.apache.xml.security.exceptions.XMLSecurityException;
import org.apache.xml.security.transforms.Transforms;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Getter
@RequiredArgsConstructor
public class DocumentWrapper {
    private final Document document;

    public DocumentWrapper(String xmlStr) {
        try {
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            documentBuilderFactory.setNamespaceAware(true);

            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();

            try(ByteArrayInputStream xmlStream = new ByteArrayInputStream(xmlStr.trim().getBytes(StandardCharsets.UTF_8))) {
                document = documentBuilder.parse(xmlStream);
                Objects.requireNonNull(document);
            }
        } catch (ParserConfigurationException | IOException | SAXException e) {
            log.error("XML parsing error", e);
            throw new ServerException("Cannot read XML", e);
        }
    }

    public Element getDocumentElement() {
        return document.getDocumentElement();
    }

    /**
     * Создает и добавляет XMLDSIG подпись
     * @return XML Signature Wrapper
     */
    public XMLSignatureWrapper createXmlSignature(CertificateWrapper certificateWrapper, String referenceUri) {
        final XMLSignatureWrapper sig = new XMLSignatureWrapper(getDocument(), certificateWrapper.getSignAlgorithmId());
        getDocument().getDocumentElement().appendChild(sig.getXmlSignature().getElement());
        Transforms transforms = new Transforms(getDocument());

        try {
            transforms.addTransform(Transforms.TRANSFORM_ENVELOPED_SIGNATURE);
            transforms.addTransform(XMLCipherParameters.N14C_XML_CMMNTS);
            sig.getXmlSignature().addDocument(Optional.ofNullable(referenceUri).orElse(""), transforms, certificateWrapper.getHashAlgorithmId());
            sig.getXmlSignature().addKeyInfo(certificateWrapper.getX509Certificate());
        } catch (XMLSecurityException e) {
            log.error("XMLDSig Signature creation error", e);
            throw new ServerException("XMLDSig Signature creation error", e);
        }

        return sig;
    }

    @Override
    public String toString() {
        try (StringWriter stringWriter = new StringWriter()) {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.transform(new DOMSource(getDocument()), new StreamResult(stringWriter));
            return stringWriter.toString();
        } catch (IOException | TransformerException e) {
            log.error("XML generation error", e);
            throw new ServerException("XML generation error", e);
        }
    }
}
