import axios from 'axios';
import { NCALayerClient } from '../api/ncalayer-client';

export const signData = async (data: string, actionType: string): Promise<string | null> => {
  const ncalayerClient = new NCALayerClient();

  try {
    console.log("Data to sign:", data);

    await ncalayerClient.connect();

    // Преобразуем данные в base64
    const base64Data = btoa(data);
    console.log("Base64 encoded data:", base64Data);

    const signedData = await ncalayerClient.createCAdESFromBase64(
      'PKCS12',
      base64Data,
      'SIGNATURE',
      true
    );

    console.log("Signed data (cms):", signedData);

    if (typeof signedData === 'string') {
      // Получаем текущее время подписи
      const signingTime = new Date().toISOString(); // Форматируем в ISO строку

      // Отправляем данные на API с добавлением `actionType`
      await axios.post('http://localhost:5000/api/logs', {
        base64Data: base64Data,
        signedData: signedData,
        signingTime: signingTime, // Добавляем время подписи
        actionType: actionType    // Указываем тип действия
      });
      return signedData;
    } else {
      console.error("Unexpected signed data format:", signedData);
      return null;
    }
  } catch (error) {
    console.error("Error signing data:", error);
    throw new Error(`Signing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
