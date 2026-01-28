from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Initialize both models
ROBERTA_MODEL_NAME = "roberta-base-openai-detector"
DEBERTA_MODEL_NAME = "microsoft/deberta-base-mnli"  # Fine-tuned on MNLI for better predictions

# Load models
roberta_tokenizer = AutoTokenizer.from_pretrained(ROBERTA_MODEL_NAME)
roberta_model = AutoModelForSequenceClassification.from_pretrained(ROBERTA_MODEL_NAME)
roberta_detector = pipeline("text-classification", model=roberta_model, tokenizer=roberta_tokenizer)

deberta_tokenizer = AutoTokenizer.from_pretrained(DEBERTA_MODEL_NAME)
deberta_model = AutoModelForSequenceClassification.from_pretrained(DEBERTA_MODEL_NAME)
deberta_detector = pipeline("text-classification", model=deberta_model, tokenizer=deberta_tokenizer)

# Model selection dictionary
detectors = {
    "roberta": roberta_detector,
    "deberta": deberta_detector
}


def detect_ai_text(text: str, model_name: str = "roberta") -> dict:
    """
    Run AI-detection on input text using selected model.
    
    Args:
        text: Input text to analyze
        model_name: "roberta" or "deberta" (default: "roberta")
    
    Returns:
        Dictionary with ai_generated_percent, human_written_percent, prediction, and model_used
    """
    # Validate model selection
    if model_name.lower() not in detectors:
        model_name = "roberta"
    
    detector = detectors[model_name.lower()]
    results = detector(text, truncation=True, max_length=512)
    
    # DeBERT-MNLI returns multiple labels, we need to extract the top one
    if isinstance(results, list):
        result = results[0]
    else:
        result = results

    label = result["label"]  # "REAL"/"FAKE" for RoBERTa, or "entailment"/"neutral"/"contradiction" for DeBERT-MNLI
    score = result["score"]  # between 0 and 1

    # Handle different label formats based on model type
    if model_name.lower() == "roberta":
        # RoBERTa: FAKE means AI-generated
        if label.upper() == "FAKE":
            ai_prob = score * 100
            human_prob = (1 - score) * 100
        else:
            human_prob = score * 100
            ai_prob = (1 - score) * 100
    else:
        # DeBERT-MNLI: Use confidence score directly, with some heuristic
        # High confidence in any label suggests real text, low confidence suggests AI
        if score > 0.7:
            # High confidence - likely human-written
            human_prob = score * 100
            ai_prob = (1 - score) * 100
        elif score < 0.4:
            # Low confidence - might be AI-generated
            ai_prob = (1 - score) * 100
            human_prob = score * 100
        else:
            # Medium confidence - use label as tiebreaker
            if label == "entailment":
                human_prob = score * 100
                ai_prob = (1 - score) * 100
            else:
                ai_prob = score * 100
                human_prob = (1 - score) * 100

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
        "model_used": model_name.lower(),
        "ai_generated_percent": round(ai_prob, 2),
        "human_written_percent": round(human_prob, 2),
        "prediction": "AI-generated" if ai_prob > human_prob else "Human-written"
    }
