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

    label = result["label"]  # "REAL"/"FAKE" for RoBERTa, or "entailment"/"neutral"/"contradiction" for DeBERT-v3
    score = result["score"]  # between 0 and 1

    if model_name.lower() == "roberta":
        # RoBERTa: Specifically trained for AI detection - trust it more
        ai_prob = score * 100
        human_prob = 100 - ai_prob
    else:
        # DeBERT-v3: General purpose model - apply confidence adjustment
        # If model is uncertain (score close to 0.5), trust it less
        # Only be confident in predictions when score is far from 0.5
        
        if score > 0.7:
            # High confidence in positive class - scale more moderately
            ai_prob = 50 + (score - 0.5) * 100  # Maps 0.5->50, 0.7->70, 1.0->100
        elif score < 0.3:
            # High confidence in negative class
            ai_prob = (score) * 100  # Maps 0->0, 0.3->30, 0.5->50
        else:
            # Medium confidence (0.3-0.7) - be conservative, closer to 50-50
            ai_prob = 45 + (score - 0.5) * 100  # Maps 0.3->35, 0.5->45, 0.7->65
        
        human_prob = 100 - ai_prob

    return {
        "model_used": model_name.lower(),
        "ai_generated_percent": round(max(0, min(100, ai_prob)), 2),  # Clamp between 0-100
        "human_written_percent": round(max(0, min(100, human_prob)), 2),
        "prediction": "AI-generated" if ai_prob > human_prob else "Human-written"
    }
