# Technical audit before new training

## Verified from supplied notebook

- Malika Fofana and Klara Mladenovic are named authors.
- Historical split uses two stratified `train_test_split` calls **by image**, not patient.
- Images are loaded in grayscale, resized to 224×224, divided by 255 and held in memory.
- ResNet50 uses ImageNet weights and three duplicated grayscale channels. The supplied notebook does not call ResNet `preprocess_input`.
- GAN minority training uses the training set only. Model selection discussion compares results on the held-out image test.
- Saved classification reports show the four results retained in HISTORICAL_RESULTS.md.

## Priority findings

**Patient leakage risk.** Patient independence cannot be established from filenames and an image-level split. Audit actual provenance and use trustworthy patient metadata. The added audit utility implements a separate group protocol, without retroactively validating old scores.

**ResNet preprocessing mismatch.** Keras ResNet50 expects its application-specific preprocessing (RGB→BGR and ImageNet channel centering). Duplicating normalized grayscale channels without that step differs from the expected input. Official reference: https://keras.io/2/api/applications/resnet/ . For a new experiment, convert grayscale [0,1] to RGB [0,255], apply `tensorflow.keras.applications.resnet.preprocess_input`, and retrain both transfer phases. Old metrics must not be attached to corrected code as if reproduced.

**Small minority test.** ModerateDemented has nine test images. A recall of 1.0 on nine examples is not strong evidence of patient-level sensitivity. Add intervals with an appropriate patient-level resampling protocol after identifying patient groups.

**Weak causal claims.** Accuracy rising after GAN enrichment does not prove improved quality. The macro-F1 deterioration is observed; generator artifacts as the cause are plausible, not established. GAN losses do not measure image realism or diversity.

**Dataset identity.** Record exact URL, version, terms, label provenance, preprocessing and subject identifiers. Do not label a Kaggle derivative as direct OASIS without evidence.

## Completed preparation

Removed personal computer paths and all outputs from the public notebook; added explicit OpenCV import and configurable cache. Extracted historical text reports into a separate file. Added exact-hash and group-isolation utility with synthetic-fixture tests.

## Not completed

No TensorFlow training, patient cohort validation, clinical review, preprocessing correction experiment, near-duplicate audit, weights export or deployment. The training requirements are a proposed historical-compatible environment, not a tested installation.

