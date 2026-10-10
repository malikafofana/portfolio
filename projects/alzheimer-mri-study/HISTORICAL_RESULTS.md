# Historical notebook outputs

Extracted from the supplied notebook; not reproduced in this environment. No medical image outputs included.

## Original cell 33

```text
============================================================
  ÉVALUATION — Baseline CNN
============================================================

Test Loss     : 1.3852
Test Accuracy : 0.4990

Classification Report :
                  precision    recall  f1-score   support

    MildDemented     0.0000    0.0000    0.0000       135
ModerateDemented     0.0000    0.0000    0.0000         9
     NonDemented     0.4995    0.9979    0.6657       480
VeryMildDemented     0.0000    0.0000    0.0000       336

        accuracy                         0.4990       960
       macro avg     0.1249    0.2495    0.1664       960
    weighted avg     0.2497    0.4990    0.3329       960
```

## Original cell 41

```text
============================================================
  ÉVALUATION — CNN Amélioré
============================================================

Test Loss     : 0.9228
Test Accuracy : 0.5198

Classification Report :
                  precision    recall  f1-score   support

    MildDemented     0.3239    0.9333    0.4809       135
ModerateDemented     0.8750    0.7778    0.8235         9
     NonDemented     0.7277    0.5792    0.6450       480
VeryMildDemented     0.4862    0.2619    0.3404       336

        accuracy                         0.5198       960
       macro avg     0.6032    0.6380    0.5725       960
    weighted avg     0.5878    0.5198    0.5170       960
```

## Original cell 54

```text
============================================================
  ÉVALUATION — ResNet50 Transfer Learning
============================================================

Test Loss     : 0.9189
Test Accuracy : 0.5479

Classification Report :
                  precision    recall  f1-score   support

    MildDemented     0.3091    0.5037    0.3831       135
ModerateDemented     0.1731    1.0000    0.2951         9
     NonDemented     0.6821    0.7063    0.6940       480
VeryMildDemented     0.5759    0.3274    0.4175       336

        accuracy                         0.5479       960
       macro avg     0.4350    0.6343    0.4474       960
    weighted avg     0.5877    0.5479    0.5497       960
```

## Original cell 82

```text
============================================================
  ÉVALUATION — CNN Amélioré + GAN
============================================================

Test Loss     : 0.8146
Test Accuracy : 0.5979

Classification Report :
                  precision    recall  f1-score   support

    MildDemented     0.4649    0.6370    0.5375       135
ModerateDemented     0.0000    0.0000    0.0000         9
     NonDemented     0.8196    0.5583    0.6642       480
VeryMildDemented     0.4911    0.6548    0.5612       336

        accuracy                         0.5979       960
       macro avg     0.4439    0.4625    0.4407       960
    weighted avg     0.6470    0.5979    0.6041       960
```
