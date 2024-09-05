import { GoogleGenerativeAI } from "@google/generative-ai";
import "marked";

var API_KEY = null;

// APIキーをチェックする
function checkAPI() {
    const KEY_NAME = "google_api_key";
    if (API_KEY) {
        return true;
    }
    const key = localStorage.getItem(KEY_NAME);
    if (key) {
        API_KEY = key;
        return true;
    } else {
        const result = prompt("APIキーを入力:");
        if (result != null) {
            API_KEY = result;
            localStorage.setItem(KEY_NAME, result);
            return true;
        } else {
            return false;
        }
    }
}

window.getMessage = async function(prompt, message) {
    // APIキーがなければ終了
    if (!checkAPI()) {
        alert("APIキーが設定されていません。");
        return;
    }

    // APIキーでGoogleGenerativeAIを作成
    const genAI = new GoogleGenerativeAI(API_KEY);
    // GenerativeModelを作成
    const model = genAI.getGenerativeModel(
        { model: "gemini-pro" }
    );

    message.innerHTML = "<p>wait...</p>";
    var result = null;
    try {
        result = await model.generateContent(prompt);
    } catch (error) {
        message.innerHTML = error;
    }
    if (result) {
        const response = await result.response;
        const content = response.text();
        message.innerHTML = marked.parse(content);
    }
}