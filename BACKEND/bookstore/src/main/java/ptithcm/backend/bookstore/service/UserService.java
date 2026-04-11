package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.dto.response.ReviewResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.UserMapper;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.repository.ReviewRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    RoleRepository roleRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_ALREADY_EXISTS);

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        user.setRole(role);

        return userMapper.toResponse(userRepository.save(user));
    }

    public List<UserResponse> getAll(){
        List<UserResponse> users = new ArrayList<>();
        for(User user : userRepository.findAll()){
            log.error(user.getUserId().toString());
            users.add(userMapper.toResponse(user));
        }
        return users;
    }

    @Transactional
    public UserResponse update(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (userRepository.existsByUsernameAndUserIdNot(request.getUsername(), userId)) {
                throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (userRepository.existsByEmailAndUserIdNot(request.getEmail(), userId)) {
                throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (userRepository.existsByPhoneAndUserIdNot(request.getPhone(), userId)) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
            user.setPhone(request.getPhone());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        if (request.getGender() != null && !request.getGender().isBlank()) {
            user.setGender(request.getGender());
        }

        if (request.getIsChangeAccount() != null) {
            user.setChangeAccount(request.getIsChangeAccount());
        }

        if (request.getPoint() != null) {
            user.setPoint(request.getPoint());
        }

        if (request.getDob() != null) {
            LocalDateTime dob = LocalDateTime.parse(request.getDob());
            user.setDob(dob);
        }

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            user.setRole(role);
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public void delete(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new AppException(ErrorCode.USER_ALREADY_DELETED);
        }

        user.setDeletedAt(LocalDateTime.now());
    }

    @Transactional
    public void changeStatusAccount(Long id, ChangeStatusAccountRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(request.getStatus());
    }

    public UserResponse getMyInfo(){
        // Lấy thông tin User hiện tại từ bộ nhớ của Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Thường là username hoặc UserDetails object
        Long userId = Long.parseLong(authentication.getName());

        // Bạn có thể dùng username này gọi xuống Database để lấy đầy đủ Object User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateMyInfo(UpdateMyInfoRequest request) {
        // Lấy thông tin User hiện tại từ bộ nhớ của Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Thường là username hoặc UserDetails object
        Long userId = Long.parseLong(authentication.getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (userRepository.existsByPhoneAndUserIdNot(request.getPhone(), userId)) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
            user.setPhone(request.getPhone());
        }

        if (request.getGender() != null && !request.getGender().isBlank()) {
            user.setGender(request.getGender());
        }

        if (request.getDob() != null) {
            LocalDateTime dob = LocalDateTime.parse(request.getDob());
            user.setDob(dob);
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public ReviewResponse createReview(CreateReviewRequest request) {

        // 1. Lấy user hiện tại
        UserResponse userResponse = getMyInfo();

        User user = userRepository.findByUsername(userResponse.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Lấy book
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // 4. Tạo review
        Review review = Review.builder()
                .book(book)
                .customer(user)
                .content(request.getComment())
                .rating(request.getRating())
                .build();

        // 5. Save
        review = reviewRepository.save(review);

        // 6. Map sang response
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .bookId(book.getBookId())
                .username(user.getUsername())
                .rating(review.getRating())
                .comment(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
