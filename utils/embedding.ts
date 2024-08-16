// ../utils/embedding.ts

import * as tf from "@tensorflow/tfjs-node";
import { AutoTokenizer, AutoModel } from "transformers";

let tokenizer: any;
let model: any;

export async function getEmbedding(text: string) {
  if (!tokenizer || !model) {
    tokenizer = await AutoTokenizer.fromPretrained(
      "sentence-transformers/all-MiniLM-L6-v2"
    );
    model = await AutoModel.fromPretrained(
      "sentence-transformers/all-MiniLM-L6-v2"
    );
  }

  const inputs = tokenizer(text, {
    return_tensors: "tf",
    truncation: true,
    max_length: 512,
  });
  const outputs = model(inputs);

  // Use TensorFlow.js methods correctly
  const meanEmbedding = tf.mean(outputs.last_hidden_state, 1); // Axis is specified as a number, not a named argument
  const squeezedEmbedding = tf.squeeze(meanEmbedding).arraySync();

  return squeezedEmbedding;
}
