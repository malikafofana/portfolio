<div align="center">

# Alzheimer's MRI — a critical deep learning study
### Model complexity is not a substitute for careful evaluation
**CNN · ResNet50 · DCGAN · Grad-CAM · Imbalance analysis**

</div>

Academic project by **Malika Fofana & Klara Mladenovic**, based on a four-class Alzheimer MRI image dataset. This public preparation preserves the original study, credits both authors, removes image outputs and local machine paths, and adds a dataset audit utility.

## Historical experiments

| Model | Accuracy | Macro-F1 | Interpretation |
|---|---:|---:|---|
| Baseline CNN | 0.4990 | 0.1664 | Almost entirely predicts NonDemented |
| Improved CNN | 0.5198 | 0.5725 | Best historical macro-F1 |
| ResNet50 transfer | 0.5479 | 0.4474 | Better accuracy, weaker balanced performance |
| Improved CNN + GAN | 0.5979 | 0.4407 | Higher accuracy, zero ModerateDemented recall |

Values are retained from supplied notebook outputs, **not rerun in this environment**. Exact original reports: [HISTORICAL_RESULTS.md](HISTORICAL_RESULTS.md). The test has 960 images, including only 9 ModerateDemented examples. Scores are descriptive results of the historical image split, not validated patient-level estimates.

The negative GAN result is valuable: generating many images from 45 minority training examples did not improve balanced classification. The observed failure is documented; a causal explanation based on generator artifacts remains a hypothesis without further analysis.

## Source and scope

6,400 preprocessed 2D images, classes MildDemented, ModerateDemented, NonDemented and VeryMildDemented. The supplied work describes a Kaggle Alzheimer MRI dataset; the exact dataset URL/version, license and patient-level provenance must be recorded before redistribution or a new experiment. The upload does not establish that these images are direct OASIS/ADNI exports.

No dataset, model weights or medical images are bundled. The notebook contains the original experiment code with minimal portability repairs. This is an educational research study, not a diagnostic application.

## Two independent workflows

### Review the historical notebook

Use Python 3.10 or 3.11 and an isolated environment:

```bash
python -m pip install -r requirements-training.txt
export MRI_DATA_DIR=/absolute/path/to/OriginalDataset
jupyter notebook study.ipynb
```

Training dependencies and training itself are **not executed here**. Review [AUDIT.md](AUDIT.md) first. A 6,400 × 224 × 224 float32 grayscale image array consumes about 1.2 GiB; RGB copies and augmentation raise memory requirements. Full CNN/ResNet/GAN training can be costly.

### Audit a licensed dataset with known patient IDs

```bash
python -m pip install -r requirements-audit.txt
python audit_dataset.py --root /absolute/path/to/images --manifest manifest.csv
python -m unittest discover -v
```

Manifest columns: `path,label,patient_id`. Paths are relative to the image root. Supply real patient IDs from trusted metadata; do not guess them from arbitrary filenames. The utility rejects missing IDs, conflicting labels, duplicate images assigned to different patients and paths outside the root. Exact duplicates are removed; group splits prevent a patient's images from crossing splits. The split is not stratified: inspect class coverage and `ready_for_training`.

This audit protocol is a **proposed improvement**, separate from the historical notebook split. Synthetic byte fixtures verify grouping logic; they do not validate an actual medical dataset.

## Reproducibility and publication

Paths now use environment variables; image outputs and execution counts were cleared; an explicit OpenCV import was added. Historical model definitions and preprocessing remain intact. No claim of reproduced training or improved clinical performance is made. Both authors retain credit; dataset redistribution and a broad open-source license need separate rights review.

