const inputText =
    document.getElementById("inputText");

const outputText =
    document.getElementById("outputText");

const fromLanguage =
    document.getElementById("fromLanguage");

const toLanguage =
    document.getElementById("toLanguage");

const translateButton =
    document.getElementById("translateButton");

const swapButton =
    document.getElementById("swapButton");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const voiceButton =
    document.getElementById("voiceButton");

const listenButton =
    document.getElementById("listenButton");

const characterCount =
    document.getElementById("characterCount");

const statusMessage =
    document.getElementById("statusMessage");



/* CHARACTER COUNTER */

inputText.addEventListener("input", function () {

    const length =
        inputText.value.length;

    characterCount.textContent =
        length + " / 5000";

});



/* TRANSLATE */

translateButton.addEventListener(
    "click",
    async function () {

        const text =
            inputText.value.trim();


        if (text === "") {

            outputText.value = "";

            statusMessage.textContent =
                "Please enter some text first.";

            return;
        }


        const sourceLanguage =
            fromLanguage.value;

        const targetLanguage =
            toLanguage.value;


        /* SAME LANGUAGE */

        if (sourceLanguage === targetLanguage) {

            outputText.value = text;

            statusMessage.textContent =
                "Both languages are the same.";

            return;
        }


        outputText.value = "";

        statusMessage.textContent =
            "Translating...";


        translateButton.disabled = true;

        translateButton.textContent =
            "Translating...";


        try {

            const url =
                "https://api.mymemory.translated.net/get?q=" +
                encodeURIComponent(text) +
                "&langpair=" +
                sourceLanguage +
                "|" +
                targetLanguage;


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Translation service error"
                );

            }


            const data =
                await response.json();


            if (
                data.responseData &&
                data.responseData.translatedText
            ) {

                outputText.value =
                    data.responseData.translatedText;

                statusMessage.textContent =
                    "Translation completed successfully.";

            }

            else {

                outputText.value = "";

                statusMessage.textContent =
                    "Sorry, translation could not be found.";

            }

        }

        catch (error) {

            console.log(error);

            outputText.value = "";

            statusMessage.textContent =
                "Translation failed. Check your internet connection.";

        }


        translateButton.disabled = false;

        translateButton.textContent =
            "Translate";

    }
);



/* SWAP LANGUAGES */

swapButton.addEventListener(
    "click",
    function () {

        const oldLanguage =
            fromLanguage.value;


        fromLanguage.value =
            toLanguage.value;


        toLanguage.value =
            oldLanguage;


        const oldText =
            inputText.value;


        inputText.value =
            outputText.value;


        outputText.value =
            oldText;


        characterCount.textContent =
            inputText.value.length +
            " / 5000";


        statusMessage.textContent =
            "Languages swapped.";

    }
);



/* CLEAR */

clearButton.addEventListener(
    "click",
    function () {

        inputText.value = "";

        outputText.value = "";

        characterCount.textContent =
            "0 / 5000";

        statusMessage.textContent =
            "Text cleared.";

    }
);



/* COPY */

copyButton.addEventListener(
    "click",
    async function () {

        if (
            outputText.value.trim() === ""
        ) {

            statusMessage.textContent =
                "There is no translation to copy.";

            return;
        }


        try {

            await navigator.clipboard.writeText(
                outputText.value
            );


            statusMessage.textContent =
                "Translation copied!";

        }

        catch (error) {

            statusMessage.textContent =
                "Could not copy the translation.";

        }

    }
);



/* VOICE INPUT */

voiceButton.addEventListener(
    "click",
    function () {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            statusMessage.textContent =
                "Voice input is not supported in this browser.";

            return;
        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            getSpeechLanguage(
                fromLanguage.value
            );


        recognition.continuous = false;

        recognition.interimResults = false;


        statusMessage.textContent =
            "Listening... Speak now 🎤";


        voiceButton.textContent =
            "🎤 Listening...";


        recognition.start();


        recognition.onresult =
            function (event) {

                const spokenText =
                    event.results[0][0].transcript;


                inputText.value =
                    spokenText;


                characterCount.textContent =
                    inputText.value.length +
                    " / 5000";


                statusMessage.textContent =
                    "Voice text added.";

            };


        recognition.onerror =
            function () {

                statusMessage.textContent =
                    "Could not hear your voice. Please try again.";

            };


        recognition.onend =
            function () {

                voiceButton.textContent =
                    "🎤 Voice";

            };

    }
);



/* TEXT TO SPEECH */

listenButton.addEventListener(
    "click",
    function () {

        const text =
            outputText.value.trim();


        if (text === "") {

            statusMessage.textContent =
                "There is no translation to listen to.";

            return;
        }


        if (!("speechSynthesis" in window)) {

            statusMessage.textContent =
                "Voice playback is not supported.";

            return;
        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang =
            getSpeechLanguage(
                toLanguage.value
            );


        speech.rate = 0.9;

        speech.pitch = 1;


        window.speechSynthesis.speak(
            speech
        );


        statusMessage.textContent =
            "Playing translation 🔊";

    }
);



/* LANGUAGE CODES FOR VOICE */

function getSpeechLanguage(language) {

    const languages = {

        en: "en-US",

        ur: "ur-PK",

        hi: "hi-IN",

        ar: "ar-SA",

        fr: "fr-FR",

        de: "de-DE",

        es: "es-ES",

        zh: "zh-CN",

        ja: "ja-JP",

        ko: "ko-KR",

        it: "it-IT",

        pt: "pt-PT"

    };


    return languages[language] || "en-US";

}

