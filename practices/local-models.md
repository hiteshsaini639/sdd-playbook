# Free models on our own machine

Many jobs inside a project are one narrow thing: cut out a background,
read a bill, write down a voice note, tag a pile of photos, translate a
sign. A free model built for that one job runs on the laptop or the
server, costs nothing per call, and the files never leave the machine.
Learned on a set of clothes photos shot on a bed (21 Nov 2026): BiRefNet
cut every background out locally, where Claude would have read each
photo at full token cost and still could not have cut it.

The list below was picked on 22 Nov 2026 from what was known in mid-2026.
New versions come out every month: before installing one, check its
current version and licence on its own page, and update the row.

## When to reach for one
- **Before Claude reads media in bulk.** A photo costs Claude about 1,500
  tokens (approx.: width × height / 750, after scaling to about 1.15
  megapixels); a PDF read as pages costs that per page. A local model that
  turns the photos, pages or recordings into a short text table saves
  nearly all of it, and Claude reads the table.
- **When Claude can't do it at all:** hear audio, cut out, enlarge or
  generate a picture.
- **Inside an app,** for a feature whose job is one narrow thing
  (`ai-features.md` → Which model).
- **Not for judgement:** what to recommend, what to write, what a person
  meant. Small models are much weaker there, so that stays with Claude.
  What a local model returns is input like any other: an amount it read
  is confirmed before it is stored.

## How to run one
- **One-off, on the laptop:** `uv run --with <package> python …`.
  Nothing is installed for good, and the model downloads once into a cache
  folder.
- **Chat and vision models:** Ollama. `ollama pull <tag>`, then its local
  API on port 11434. The tags are in the tables.
- **Check the first result before the batch.** Look at one output where a
  fault would show (a cut-out over a bright colour, an OCR of the
  smallest print), then run the rest. Learned when `isnet-general-use`
  left a black sleeve half see-through on a patterned sheet, and BiRefNet
  didn't (21 Nov 2026).
- **The machine:** the laptop (`machines.md`) has Intel graphics and no
  NVIDIA card, so everything here runs on the processor, and image
  generation runs slowly. Intel's OpenVINO can use the graphics and the AI
  unit for many of these; not tried yet. On a server, a model loads whole
  into memory: the small ones (OCR, tagging, search, cut-outs) fit, but
  check the memory before speech-to-text large or image generation.

## By job
**Tried** says a project used it, with the date and what it showed. The
first project to use a row fills it in (`learning-loop.md`).

### Photos: cut, clean, enlarge
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Remove the background | BiRefNet, `birefnet-general` (MIT) | rembg | 21 Nov 2026: about 25 s a photo on the laptop; clean on a busy background |
| The same, faster and rougher | `birefnet-general-lite`, `isnet-general-use` (MIT) | rembg | isnet: the sleeve above |
| Pick out one thing by a click or a box | SAM 2 (Apache 2.0) | `sam2` | |
| Erase an object from a photo | LaMa (Apache 2.0) | IOPaint | |
| Enlarge 4× | Real-ESRGAN (BSD-3) | `realesrgan-ncnn-vulkan`, the Upscayl app | |

### Photos: tag, sort, search
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Search photos by words, tag them, find duplicates | CLIP, SigLIP (MIT, Apache 2.0) | open_clip | |
| Caption, find objects, read text in a photo | Florence-2 (MIT) | transformers | |
| Ask a question about a photo | Qwen2.5-VL 7B (Apache 2.0), Gemma 3 4B (Gemma terms) | Ollama `qwen2.5vl:7b`, `gemma3:4b` | |
| A photo library with search and faces | Immich (AGPL), self-hosted | its compose file | |

### Text from pictures and documents
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Phone photos of bills, receipts, signs; Hindi and other scripts | PaddleOCR (Apache 2.0) | `paddleocr` | |
| PDFs to Markdown, tables kept | Docling (MIT) | `docling` | |
| Clean printed scans | Tesseract (Apache 2.0) | `tesseract-ocr` | |

### Audio and speech
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Speech to text, many languages, Hindi among them | Whisper large-v3-turbo (MIT) | faster-whisper, whisper.cpp | |
| Who spoke when | pyannote (MIT; accept the model's terms on Hugging Face) | WhisperX | |
| Text to speech, English | Kokoro-82M (Apache 2.0) | `kokoro` | |
| Text to speech, Indian languages | Indic Parler-TTS (Apache 2.0); Piper, lighter (each voice has its own licence) | transformers; `piper` | |
| Noise out of a recording; a voice apart from music | DeepFilterNet (MIT, Apache 2.0); Demucs (MIT) | `deepfilternet`; `demucs` | |

### Translation
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| English ↔ 22 Indian languages | IndicTrans2 (MIT) | its repo's scripts | |

### Text: small models for bulk work
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Label many rows, pull fields out as JSON, summarise a long log | Qwen3 8B (Apache 2.0), Gemma 3 12B (Gemma terms) | Ollama `qwen3:8b`, `gemma3:12b` | |
| The strongest that fits in 30 GB | gpt-oss-20b (Apache 2.0) | Ollama `gpt-oss:20b` | |
| Code completion in the editor | Qwen2.5-Coder 7B (Apache 2.0) | Ollama `qwen2.5-coder:7b` | |
| Search by meaning: the few passages that matter out of many | bge-m3 (MIT), nomic-embed-text (Apache 2.0); bge-reranker-v2-m3 (Apache 2.0) to rank them | Ollama `bge-m3`, `nomic-embed-text` | |

For a folder of notes, try a plain text search first: it is often enough.

### Video and pictures
| Job | Model (licence) | Run with | Tried |
|---|---|---|---|
| Subtitles | Whisper to `.srt`, burned in by ffmpeg | faster-whisper, ffmpeg | |
| Cut footage at each scene | PySceneDetect (BSD-3; an algorithm, not a model) | `scenedetect` | |
| Make a picture: a poster, a product backdrop | FLUX.1 schnell (Apache 2.0) | ComfyUI | |

## Not for a business
Free to try, but not in a product that earns money: BRIA RMBG-2.0,
CodeFormer, InsightFace's models, FLUX.1 dev, NLLB-200 and Qwen2.5-VL 3B
are non-commercial; Ultralytics YOLO is AGPL, so the app using it must
publish its own code; Surya and Marker are free only below a revenue size.
Read the licence again before shipping: licences change.
