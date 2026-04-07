package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateAddressRequest;
import ptithcm.backend.bookstore.dto.response.AddressResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.Address;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.AddressMapper;
import ptithcm.backend.bookstore.repository.AddressRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AddressService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    UserService userService;
    AddressMapper addressMapper;


    @Transactional
    public AddressResponse create(CreateAddressRequest request){
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
}
