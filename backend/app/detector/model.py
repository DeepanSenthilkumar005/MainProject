from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Use RoBERTa AI detector (public + working)
MODEL_NAME = "roberta-base-openai-detector"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

detector = pipeline("text-classification", model=model, tokenizer=tokenizer)


def detect_ai_text(text: str) -> dict:
    """
    Run AI-detection on input text.
    Returns probability as percentage.
    """
    result = detector(text, truncation=True, max_length=512)[0]

    label = result["label"]  # "REAL" or "FAKE"
    score = result["score"]  # between 0 and 1

    # If label is FAKE -> it's AI-generated, else it's human
    if label.upper() == "FAKE":
        ai_prob = score * 100
        human_prob = (1 - score) * 100
    else:
        human_prob = score * 100
        ai_prob = (1 - score) * 100

    # Ensure at least 10% difference in probabilities
    diff = abs(ai_prob - human_prob)
    if diff < 10:
        if ai_prob > human_prob:
            ai_prob = 55
            human_prob = 45
        else:
            ai_prob = 45
            human_prob = 55

    return {
        "ai_generated_percent": round(ai_prob, 2),
        "human_written_percent": round(human_prob, 2),
        "prediction": "AI-generated" if ai_prob > human_prob else "Human-written"
    }
