package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateAddressRequest;
import ptithcm.backend.bookstore.dto.request.UpdateAddressRequest;
import ptithcm.backend.bookstore.dto.response.AddressResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.Address;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.AddressMapper;
import ptithcm.backend.bookstore.repository.AddressRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AddressService {
    UserRepository userRepository;
    AddressRepository addressRepository;
    UserService userService;
    AddressMapper addressMapper;


    @Transactional
    public AddressResponse create(CreateAddressRequest request) {
        UserResponse userResponse = userService.getMyInfo();

        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = Address.builder()
                .detailAddress(request.getDetailAddress())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .district(request.getDistrict())
                .ward(request.getWard())
                .province(request.getProvince())
                .user(user)
                .build();


        return addressMapper.toResponse(addressRepository.save(address));
    }

    public List<AddressResponse> getAll() {
        UserResponse userResponse = userService.getMyInfo();

        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<AddressResponse> addresses = new ArrayList<>();
        for (Address address : addressRepository.findByUser_userId(user.getUserId())) {
            addresses.add(addressMapper.toResponse(address));
        }
        return addresses;

    }

    @Transactional
    public AddressResponse update(Long id, UpdateAddressRequest request) {
        UserResponse userResponse = userService.getMyInfo();

        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Kiểm tra xem địa chỉ này có thuộc về user hiện tại không
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        if (request.getProvince() != null) {
            address.setProvince(request.getProvince());
        }

        if (request.getDistrict() != null) {
            address.setDistrict(request.getDistrict());
        }

        if (request.getWard() != null) {
            address.setWard(request.getWard());
        }

        if (request.getDetailAddress() != null) {
            address.setDetailAddress(request.getDetailAddress());
        }

        if (request.getCustomerName() != null) {
            address.setCustomerName(request.getCustomerName());
        }

        if (request.getCustomerPhone() != null) {
            address.setCustomerPhone(request.getCustomerPhone());
        }

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public void delete(Long id) {
        UserResponse userResponse = userService.getMyInfo();

        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Kiểm tra xem địa chỉ này có thuộc về user hiện tại không
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        address.setDeletedAt(LocalDateTime.now());
    }
}

