---
tags:
  - 디자인패턴
  - SOLID
  - DIP
---
### **의존 역전 원칙 (Dependency Inversion Principle)**

**정의**: 고수준 모듈(비즈니스 로직)은 저수준 모듈(세부 구현)에 의존해서는 안 된다. 둘 다 추상화에 의존해야 하며, 추상화는 세부 사항에 의존하지 않는다.

### **핵심 개념**
1. **추상화에 의존**: 구현체 대신 인터페이스나 추상 클래스에 의존해야 한다.
2. **유연한 설계**: 고수준 모듈과 저수준 모듈의 결합도를 낮추고 시스템의 변경에 강한 구조를 만든다.
3. **의존성 주입(DI)**: 객체 간의 의존성을 외부에서 주입하여 런타임에 동적으로 변경할 수 있게 한다.

---

### **문제점 (원칙을 지키지 않은 경우)**
- 고수준 모듈이 특정 저수준 모듈에 강하게 결합되어 변경이 어렵다.
- 테스트 코드 작성이 어렵고, 재사용성이 낮다.

---

### **적용 방법**
1. **인터페이스 설계**: 구현체 대신 인터페이스를 통해 의존성을 정의한다.
2. **의존성 주입**: 생성자, 메서드, 혹은 프레임워크를 사용하여 의존성을 주입한다.
3. **서비스 추상화**: 고수준 모듈은 추상적인 서비스에 의존하며, 저수준 모듈이 이를 구현한다.

---

### **예제 코드**
#### 잘못된 예 (의존 역전 원칙 위반)
```java
@Service
public class OrderService {

    private final OrderRepository orderRepository = new OrderRepository(); // 직접 의존

    public void createOrder(Order order) {
        orderRepository.save(order); // OrderRepository에 직접 의존
    }
}

@Repository
public class OrderRepository {
    public void save(Order order) {
        System.out.println("Order saved: " + order);
    }
}


```

**문제점**
- `OrderService`가 `OrderRepository`라는 구체 클래스에 직접 의존하고 있다.
- `OrderRepository` 변경 시 `OrderService`도 수정해야 한다.
- 테스트 시 `OrderRepository`를 Mocking하기 어려워진다.

#### 개선된 예 (의존 역전 원칙 준수)
#### 1. **OrderController (고수준 모듈)**

```java
@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    // 생성자 주입을 통한 의존성 주입
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 주문 생성 API
    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
        return ResponseEntity.ok("Order created successfully");
    }
}

```

#### 2. **OrderService (비즈니스 로직, 고수준 모듈)**
```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    // 생성자 주입을 통한 의존성 주입
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 주문 처리 로직
    public void createOrder(Order order) {
        orderRepository.save(order);  // 주문 저장
    }
}

```

#### 3. **OrderRepository (저수준 모듈)**
```java
@Repository
public class JpaOrderRepository implements OrderRepository {

    // 실제 저장 로직 구현
    @Override
    public void save(Order order) {
        System.out.println("JPA를 통해 Order 저장: " + order);
    }
}

```

### **장점**
1. **변경 용이성**
    - 새로운 데이터 저장소(`OrderRepository`) 구현체를 추가할 때 기존 코드를 수정할 필요가 없다.
	```java
		@Repository
		public class MongoOrderRepository implements OrderRepository {
		    // MongoDB에 주문 저장하는 로직을 구현한다고 가정
		    @Override
		    public void save(Order order) {
		        System.out.println("몽고디비에 주문 저장 " + order);
		    }
		}
	```
2. **테스트 용이성**
    - `OrderRepository`의 Mock 객체를 사용하여 비즈니스 로직 테스트가 가능하다.
	**OrderService Test (서비스 계층 테스트)**
	
	먼저, `OrderService`가 `MongoOrderRepository`와 잘 연결되는지 테스트한다. 이를 위해 `@MockBean`을 사용하여 `OrderRepository`를 mock 처리할 수 있다.
	```java
	@RunWith(SpringRunner.class)
	@SpringBootTest
	public class OrderServiceTest {
	
	    @Autowired
	    private OrderService orderService;  // 테스트 대상
	
	    @MockBean
	    private OrderRepository orderRepository;  // Mock된 repository
	
	    @Test
	    public void testCreateOrder() {
	        // 테스트용 주문 객체
	        Order order = new Order(1, "Product A");
	
	        // save() 메서드 호출 시 아무 동작도 하지 않도록 설정
	        Mockito.doNothing().when(orderRepository).save(Mockito.any(Order.class));
	
	        // createOrder 호출
	        orderService.createOrder(order);
	
	        // save가 한 번 호출되었는지 검증
	        Mockito.verify(orderRepository, Mockito.times(1)).save(order);
	    }
	}
	
	```
	**OrderController Test (컨트롤러 계층 테스트)**
	`OrderController`에서 POST 요청이 정상적으로 처리되는지 테스트한다.
	```java
		@RunWith(SpringRunner.class)
		@WebMvcTest(OrderController.class)
		public class OrderControllerTest {
		
		    @Autowired
		    private MockMvc mockMvc;  // MockMvc로 HTTP 요청을 시뮬레이션
		
		    @MockBean
		    private OrderService orderService;  // Mock된 서비스
		
		    @Test
		    public void testCreateOrder() throws Exception {
		        // 테스트용 주문 객체
		        Order order = new Order(1, "Product A");
		
		        // 서비스의 createOrder 메서드가 호출되도록 설정
		        Mockito.doNothing().when(orderService).createOrder(Mockito.any(Order.class));
		
		        // POST 요청을 보내고 응답 검증
		        mockMvc.perform(post("/orders")
		                .contentType(MediaType.APPLICATION_JSON)
		                .content("{\"id\":1, \"product\":\"Product A\"}"))
		                .andExpect(status().isOk())
		                .andExpect(jsonPath("$.message").value("Order created successfully"));
		
		        // 서비스의 createOrder 메서드가 한 번 호출되었는지 검증
		        Mockito.verify(orderService, Mockito.times(1)).createOrder(order);
		    }
		}
		
	```

3. **유지보수성 향상**
    - 고수준 모듈은 다양한 구현체와 호환 가능하며 시스템 변경에 민감하지 않다.

### **결론**
의존 역전 원칙을 적용하면 각 계층 간 결합도를 낮추고, 시스템의 확장성, 테스트 용이성, 유지보수성을 높일 수 있다