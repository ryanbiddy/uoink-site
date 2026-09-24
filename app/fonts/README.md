# Local site fonts

Inter (normal and italic), Bungee, and JetBrains Mono retain the existing site typography. Local assets let the static export build without fetching Google Fonts. The four WOFF files total 246,476 bytes. Each family’s SIL Open Font License is included beside it.

Retrieved from the official [google/fonts repository](https://github.com/google/fonts) on 2026-09-23:

| Source | Git blob SHA |
| --- | --- |
| `ofl/inter/Inter[opsz,wght].ttf` | `047c92f6e2212473dc436020afed689527076d44` |
| `ofl/inter/Inter-Italic[opsz,wght].ttf` | `c177578428248f08eedcc60e292acc6f414c2167` |
| `ofl/bungee/Bungee-Regular.ttf` | `59dfddc539f9ebbaf5134c7b272970d88aba0ba9` |
| `ofl/jetbrainsmono/JetBrainsMono[wght].ttf` | `aa310be8b717fe3774f9444dd89d5f4101cc6d10` |

Subset with FontTools, preserving variable weight axes:

```sh
python -B -m fontTools.subset SOURCE.ttf --output-file=OUTPUT.woff --flavor=woff --unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD
```
