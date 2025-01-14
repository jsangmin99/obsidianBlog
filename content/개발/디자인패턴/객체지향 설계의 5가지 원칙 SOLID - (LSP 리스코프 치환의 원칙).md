---
tags:
  - 디자인패턴
  - SOLID
  - LSP
---

## 1. 리스코프 치환의 원칙
**"자식 클래스는 부모 클래스에서 기대되는 행동을 깨뜨리지 않고 부모 클래스를 대체할 수 있어야 한다."**
- 즉 부모 클래스의 객체를 사용하는 모든 코드에서 자식 클래스의 객체로 대체해도 프로그램의 동작에 문제가 없어야 한다는 뜻
- **자식 클래스는 부모 클래스의 규약을 반드시 준수해야 한다.**
	- 자식클래스는 부모 클래스의 내용을 삭제하거나 수정하면 안된다.


## 2. 예시
### 2-1 안좋은 예시
####  상황
- 부모 클래스는 "메시지를 발송한다"는 기능을 제공
- 자식 클래스는 메시지를 저장하는 것이 아니라 메시지를 저장한다는 기능으로 바꾼다.


```java
// 부모 클래스: 메시지 발송 서비스
@Component
public class MessageService {
    public void sendMessage(String message) {
        System.out.println("메시지 발송: " + message);
    }
}

// 자식 클래스: 메시지를 저장하는 기능으로 변경 (계약 위반)
@Component
public class SaveMessageService extends MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("메시지 저장: " + message); // 메시지 발송을 하지 않음
    }
}

// 클라이언트 코드
@Service
public class NotificationService {

    private final MessageService messageService;

    @Autowired
    public NotificationService(MessageService messageService) {
        this.messageService = messageService;
    }

    public void notify(String message) {
        messageService.sendMessage(message); // 메시지가 발송되길 기대
    }
}

// 메인 클래스
@SpringBootApplication
public class LspViolationApplication {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(LspViolationApplication.class, args);

        NotificationService notificationService = context.getBean(NotificationService.class);
        notificationService.notify("Hello, LSP!");
    }
}

```

##### **결과**
- `NotificationService`는 메시지가 발송되길 기대하지만, `SaveMessageService`를 주입받으면 메시지가 발송되지 않고 저장만 되는 문제
- 부모 클래스의 동작 규칙을 자식 클래스가 어겼기 때문에 예상치 못한 문제가 발생
- 개인 혼자라면 이를 기억할수 있지만 팀원이 있을 경우 이를 파악하기 어려움

### 2-2 좋은 예시
#### 상황
- 부모 클래스는 "메시지를 발송한다"는 기능을 제공
- 자식 클래스는 메시지를 저장하는 것이 아니라 메시지를 저장한다는 기능으로 바꾸는 것이 아니라 **추가한다.**
- 부모 클래스의 "메시지를 발송한다." 를 유지한 채로 여러 방법으로 "메시지를 발송하는 기능 추가"

```java
// 부모 클래스: 메시지 발송 서비스
@Component
public class MessageService {
    public void sendMessage(String message) {
        System.out.println("메시지 발송: " + message);
    }
}

// 자식 클래스: 메시지를 저장하는 메서드를 추가 (계약 준수)
@Component
public class SaveAndSendMessageService extends MessageService {
    public void saveMessage(String message) {
        System.out.println("메시지 저장: " + message);
    }
}

// 클라이언트 코드
@Service
public class NotificationService {

    private final MessageService messageService;

    @Autowired
    public NotificationService(MessageService messageService) {
        this.messageService = messageService;
    }

    public void notify(String message) {
        if (messageService instanceof SaveAndSendMessageService) {
            ((SaveAndSendMessageService) messageService).saveMessage(message); // 메시지를 저장
        }
        messageService.sendMessage(message); // 메시지를 발송
    }
}

// 메인 클래스
@SpringBootApplication
public class LspComplianceApplication {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(LspComplianceApplication.class, args);

        NotificationService notificationService = context.getBean(NotificationService.class);
        notificationService.notify("Hello, LSP with Contract Compliance!");
    }
}


```

#### 결과

- `SaveAndSendMessageService`는 부모 클래스의 기능(메시지 발송)을 유지하면서 메시지 저장 기능을 추가한다.
- `NotificationService`는 부모 클래스 타입(`MessageService`)을 사용할 수 있으며, 자식 클래스(`SaveAndSendMessageService`)를 주입받더라도 예상대로 동작한다.
- 하지만 전에 배웠던 단일 책임원칙을 위반하는것 같다... 아래에 수정해서 알려주겠다.
```java
@Component
public class MessageSaver {
    public void saveMessage(String message) {
        System.out.println("메시지 저장: " + message);
    }
}

@Component
public class MessageSender {
    public void sendMessage(String message) {
        System.out.println("메시지 발송: " + message);
    }
}


@Service
public class NotificationService {

    private final MessageSaver messageSaver;
    private final MessageSender messageSender;

    @Autowired
    public NotificationService(MessageSaver messageSaver, MessageSender messageSender) {
        this.messageSaver = messageSaver;
        this.messageSender = messageSender;
    }

    public void notify(String message) {
        messageSaver.saveMessage(message);  // 메시지 저장
        messageSender.sendMessage(message); // 메시지 발송
    }
}


```