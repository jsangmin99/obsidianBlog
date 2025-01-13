---
tags:
  - 디자인패턴
  - SOLID
---
## 1. 개방 폐쇄 원칙 (OCP)
"확장에는 열려있어야하며, 수정에는 닫혀있어야 한다."
- 확장에 열려있다 -> 기능이 추가된다, 모듈이 추가된다.
- 수정에 닫혀있다 -> 객체를 직접적으로 수정하지 않는다, 수정을 최소화한다

- 객체지향에있는 추상화를 생각해보면 이해가 쉽다.
	- 뭔가 추가하거나 수정할때는 상속 관계만 맞게 적절히 추가 한다면 유연하게 확장할수있다.

예시를 들어보겠다.

## 2. 예시
###  2-1 상황
- 간단하게 결제 시스템을 만들고자한다.
1. 카드결제 
2. 카카오페이 간편결제 
- 빠르게 서비스를 개발하기 위해 우선은 2가지 기능만 넣는다. 추후헤 다른 결제 방식이 추가될수 있다.

### 2-2 안좋은 예시
```java
public class paymentService {
	public void processPayment(String paymentType) {
        if ("creditCard".equals(paymentType)) {
            System.out.println("카드결제 진행중...");
        } else if ("kakaoPay".equals(paymentType)) {
            System.out.println("카카오페이 결제 진행중...");
        } else {
            throw new IllegalArgumentException("Unknown payment type");
        }
    }
}
```

- 이럴경우 새로운 결제 방식이 추가될때마다 if문이 증가한다.
- 만약 카카오 페이 뿐만 아니라 토스페이, kb페이, 티머니, 신한.... 등등이 있다면! if문이 많아져 찾기 힘들고 실수도 늘어날것이다.

### 2-3 좋은 예시

1. **인터페이스를 통해 결제 방식을 추상화 한다.**
	 - 결제 방식을 추가 하여 기존 코드를 수정하지 않고 새로운 결제방식을 추가 
	   (**수정**에 닫혀있고 **확장**엔 열림)
	   
```java
// 결제 방식 인터페이스
public interface PaymentProcessor {
	String getPaymentType();
    void process();
}
```

```java
// 신용카드 결제 구현
@Component
public class CreditCardPaymentProcessor implements PaymentProcessor {
    @Override
    public String getPaymentType() {
        return "creditCard";
    }
    
    @Override
    public void process() {
        System.out.println("신용카드 결제중...");
    }
}

// 카카오페이 결제 구현
@Component
public class KakaoPayPaymentProcessor implements PaymentProcessor {
    @Override
    public String getPaymentType() {
        return "kakaoPay";
    }
    
    @Override
    public void process() {
        System.out.println("카카오페이 결제중...");
    }
}

```


- PaymentService 에서는 결제 방식을 동적으로 설정
```java
@Service
public class PaymentService {

    private final Map<String, PaymentProcessor> paymentProcessorMap;

    @Autowired
    public PaymentService(List<PaymentProcessor> paymentProcessors) {
        this.paymentProcessorMap = paymentProcessors.stream()
            .collect(Collectors.toMap(PaymentProcessor::getPaymentType, p -> p));
    }

    public void processPayment(String paymentType) {
        PaymentProcessor processor = paymentProcessorMap.get(paymentType);

        if (processor == null) {
            throw new IllegalArgumentException("지원하지 않는 결제 방식입니다: " + paymentType);
        }

        processor.process();
    }
}


```

- 만약 여기에 토스 결제 방식을 추가 하고 싶을 경우

```java
// 토스페이 추가
@Component
public class TossPayPaymentProcessor implements PaymentProcessor {
    @Override
    public String getPaymentType() {
        return "tossPay";
    }
    
    @Override
    public void process() {
        System.out.println("토스페이 결제중...");
    }
}
```

- 위와 같이 토스페이 관련 구현체를 만들어 수정엔 닫혀있고 확장엔 열린 구조를 만들수 있다.


- 또 다른 예시를 가볍게 이야기하자면 데이터베이스 인터페이스인 JDBC 를 예시로 찾을수도 있다.
   만약 내가 OracleDB 를 쓰고 있는데 PostgreSQL 로 바꾸고 싶다면 복잡한것 없이 connection 객체 부분만 수정하면 된다.

## 3. OCP 원칙 적용 주의점
- 추상화는 어렵다...설계를 잘 해야한다... 아니 그냥 무작정 잘 해야한다고 하는것은 모호할뿐더러 무책임 하다고 할수있지만 이러한 설계, 추상화 레벨을 잘 설정하는것이 개발자의 역량이자 경혐을 통해 얻을수있는 능력인것 같다.
- 추상화에 대한 상속구조를 이상하게 할경우LSP(리스코프 치환)의 원칙과 ISP(인터페이스 분리 원칙)에 위반될수 있기 때문에 잘 설정해야한다.
- OCP 는 DIP(의존 역전 원칙)의 설계 기반이 되기도 한다. 그러니 이를 계속하여 생각하며 설계하여야 한다.