## 사용 방법

configs.ts에 generate에 필요한 각종 constant들이 들어 있습니다.

기본적으로는 바꿀 일이 없습니다만, 맵이나 무기가 추가되는 업데이트가 발생하면 `TARGET_VERSION`을 적절히 바꿔주세요!

```
deno run --allow-net --allow-write --allow-run scripts/generateConstants/mod.ts
```