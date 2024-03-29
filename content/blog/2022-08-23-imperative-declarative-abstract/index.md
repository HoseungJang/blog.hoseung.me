---
title: 명령형 코드와 선언형 코드, 그리고 추상화 다시보기
date: 2022-08-23T00:00:00+09:00
description: 우리는 너무 단순하게 생각하고 있다
thumbnail: ./thumbnail.png
tags:
  - 코드 퀄리티
---

회사 슬랙에서 명령형, 선언형 코드에 대해 이야기가 오간 쓰레드를 읽게 되었는데요. 내용이 너무 좋다고 생각되어서 블로그에 공유해보려고 합니다.

## 명령형? 선언형? 추상화?

명령형과 선언형, 둘을 구분짓는 키워드를 흔히 들어보셨을겁니다.

- How: 명령형
- What: 선언형

좀 더 와닿도록 간단한 예시를 작성해볼까요?

```typescript
// 명령형
let max = 0;
const arr = [1, 5, 3];
for (let i = 0; i < arr.length; i++) {
  if (max < arr[i]) {
    max = arr[i];
  }
}
console.log(max); // 5
```

```typescript
// 선언형
const arr = [1, 5, 3];
const result = Math.max(...arr);
console.log(result); // 5
```

명령형 예제의 경우, `arr`을 처음부터 끝까지 순회하면서, 각 요소와 현재의 최댓값을 비교해가며 결과를 도출합니다. 즉, 우리가 원하는 결과인 최댓값을 **어떻게** 도출하는지가 코드에 드러납니다.

반대로 선언형 예제의 경우, `Math.max` 함수를 사용해서 주어진 값들 중 최댓값을 도출합니다. 명령형 예제와 달리, **어떤** 결과가 도출되길 원하는지가 코드에 드러납니다.

우리는 여기서 **추상화**라는 개념에 대해서도 알 수 있습니다.

개발자들은 본능적으로 복잡한 코드가 늘어지면 읽기 싫어합니다.(~~저만 그런가요?~~) 위의 명령형 예제를 처음 봤을 때, 과연 누가 즐겁게 읽고싶은 마음이 들까요?

따라서 그런 코드들을 아래와 같이 별도의 함수로 분리하여 사용하게 됩니다.

```typescript
// ./utils/math.ts

export function max(arr: number[]) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (max < arr[i]) {
      max = arr[i];
    }
  }
  return max;
}
```

```typescript
import { max } from "./utils/math";

const arr = [1, 5, 3];
const result = max(arr);
console.log(result); // 5
```

이때, 최댓값을 구하는 상세한 과정(How)은 숨겨졌지만, 개발자는 `max`라는 이름만 보고도 이 함수가 무엇을 하는지(What)를 알 수 있게됩니다.

즉, 특정 결과를 만드는 코드에 대하여,

- 그 결과를 어떻게 만드는지에 대한 상세한 **구현**은 숨기고,
- 그 결과가 무엇인지, 그 결과를 만들기 위해 무엇이 필요한지를 직관적으로 드러내는 것

이를 **추상화**라고 말합니다.

## 선언형 코드는 명령형 코드의 추상화된 형태이다

아까 위에서 봤던 예제들 중,

- 선언형 예제
- 추상화 예제

를 가져와서 비교해볼까요?

```typescript
// 선언형 예제
const arr = [1, 5, 3];
const result = Math.max(...arr);
console.log(result); // 5
```

```typescript
// 추상화 예제
import { max } from "./utils/math";

const arr = [1, 5, 3];
const result = max(arr);
console.log(result); // 5
```

둘을 보면서 어떤 생각이 드시나요?

최댓값(What)을 도출하기 위한 `Math.max` 함수와, 이와 똑같은 결과를 구하는 명령형 코드를 추상화 했던 `max` 함수.

어떤 결과를 구하는지, 무엇이 필요한지, 모두 완벽히 똑같은 형태가 아니던가요?

즉, 우리는 명령형 코드로부터 How를 숨기고 What을 드러내는 추상화를 통해, 선언형 코드를 얻을 수 있습니다. 이를 바꿔말하면, 추상화된 코드라면 선언형 코드입니다.

하지만, 위 명제는 엄밀히 따지면 거짓입니다.

추상화는 선언형 코드이기 위한 필요조건 중 하나이며, 위 명제가 참이 되려면 조건을 조금 보충해야 합니다.

## 선언형 코드의 결과는 멱등성을 가진다

선언형 코드의 결과는 근본적으로 멱등성을 가져야 합니다.

풀어서 설명하면, What이 변하지 않는다면 몇 번을 실행하더라도 같은 결과를 뱉어야 한다는 뜻입니다. 하지만, How의 경우 실행할 때마다 결과가 달라질 수 있습니다.

예시를 하나 만들어 볼까요?

좌표상에서 (2, 4)에 있는 캐릭터를 (0, 0)으로 옮기고 싶습니다. 이를 명령형, 선언형 코드로 각각 표현해보겠습니다.

```typescript
// 명령형
moveX(-2);
moveY(-4);
```

```typescript
// 선언형
moveTo(0, 0); // moveTo(x, y)
```

명령형 코드의 경우, 현재 위치인 (2, 4)에서 X축으로 -2만큼 이동, Y축으로 -4만큼 이동해서 (0, 0)으로 이동합니다. 목적지에 도착하기 위해 어떻게 이동할지가 드러납니다.

선언형 코드의 경우, 우리가 원하는 목적지인 (0, 0)으로 이동합니다. 어떻게 이동할지가 아니라 어디로 이동할지가 코드에 드러납니다.

감이 잡히시나요?

명령형 코드의 경우, 여러번 실행하면 (0, 0)을 지나 어디까지 이동할지 알 수 없습니다. 하지만 선언형 코드의 경우 목적지가 (0, 0)이라는 요구사항이 변하지 않는 이상, 몇 번을 실행하던 캐릭터의 위치는 (0, 0)입니다.

즉, 멱등성을 가지고 추상화된 코드는 선언형 코드라고 볼 수 있습니다.

## 목적에 따라서도 달라질 수 있다

코드를 작성한 목적에 따라서도 그 코드가 명령형인지, 선언형인지는 달라질 수 있습니다.

위에서 작성했던 캐릭터의 위치를 명령형으로 이동시키는 예제를 다시 볼까요?

```typescript
moveX(-2);
moveY(-4);
```

만약 개발자의 목적이 캐릭터를 X축으로 -2, Y축으로 -4만큼 이동시키는 것이라면? 위 코드는 충분히 선언적입니다. moveX, moveY는 추상적이며, 위 코드를 몇 번을 실행하더라도 'X축으로 -2, Y축으로 -4만큼 이동'이라는 똑같은 결과를 도출합니다.

하지만 개발자의 목적이 캐릭터를 특정 위치로 이동시키는 것이라면? 위 코드가 여러번 실행되면 개발자가 원하는 결과를 도출하지 못합니다.

이처럼 애플리케이션 또는 개발자의 목적에 따라서도 우리의 코드는 선언형이 되기도, 명령형이 되기도 합니다.

## 결론

1. 명령형, 선언형, 추상화
   - How를 드러내는 것은 명령헝
   - What을 드러내는 것은 선언형
   - How를 숨기고 What을 드러내는 행위는 추상화
2. 무엇이 선언형 코드인가?
   - 명령형 코드의 추상화된 형태
   - 몇 번을 실행하더라도 같은 결과를 도출하는, 즉 멱등성을 가지는 코드
     - '같은 결과'라 함은 코드의 목적(What)에 의존한다.

원래 잘 구분하지 못했던 개념도 정리가 되었고, 평소 깊게 생각해보지 않았던 부분이라 좋았던 것 같습니다.

이 주제에 대해 다른 의견이 있으시면 댓글로 달아주세요. 같이 얘기해보고 싶어요!
