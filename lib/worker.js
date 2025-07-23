import { pipeline, env } from "@huggingface/transformers";

env.allowLocalModels = false;

class PipelineSingleton {
  static task = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        progress_callback,
        // device: "webgpu",
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  const pipe = await PipelineSingleton.getInstance((x) => {
    self.postMessage(x);
  });

  let output = await pipe(event.data.text, {
    src_lang: "zho_Hans",
    tgt_lang: "eng_Latn",
  });
  const eng = output[0].translation_text;
  console.log({ eng });

  output = await pipe(eng, {
    src_lang: "eng_Latn",
    tgt_lang: "jpn_Jpan",
  });
  const jpn = output[0].translation_text;
  console.log({ jpn });

  output = await pipe(jpn, {
    src_lang: "jpn_Jpan",
    tgt_lang: "zho_Hans",
  });
  console.log({ output });

  self.postMessage({
    status: "complete",
    output: output,
  });
});
