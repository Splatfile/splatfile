## 필요한 의존성

- ImageMagick

서브와 스페셜 이미지는, 적절한 후처리를 거쳐야만 제대로 사용할 수 있습니다. 이를 위해 ImageMagick 커맨드를 사용하므로 설치해주세요!

```sh
# Mac OS
brew install imagemagick
# Ubuntu, etc
apt install imagemagick
```

## 사용 방법

configs.ts에 generate에 필요한 각종 constant들이 들어 있습니다.

기본적으로는 바꿀 일이 없습니다만, 맵이나 무기가 추가되는 업데이트가 발생하면 `TARGET_VERSION`을 적절히 바꿔주세요!

```
deno run --allow-net --allow-write --allow-read --allow-run scripts/generateConstants/mod.ts
```