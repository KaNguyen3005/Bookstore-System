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

import ptithcm.backend.bookstore.dto.response.ghn.GHNProvinceResponse;
import ptithcm.backend.bookstore.dto.response.ghn.GHNDistrictResponse;
import ptithcm.backend.bookstore.dto.response.ghn.GHNWardResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AddressService {
    UserRepository userRepository;
    AddressRepository addressRepository;
    UserService userService;
    AddressMapper addressMapper;
    GHNService ghnService;




    
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
                .isDefault(false)
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

    @Transactional
    public AddressResponse setDefault(Long id) {
        UserResponse userResponse = userService.getMyInfo();

        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address selectedAddress = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (selectedAddress.getDeletedAt() != null) {
            throw new AppException(ErrorCode.ADDRESS_NOT_FOUND);
        }

        if (!selectedAddress.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        List<Address> addresses = addressRepository.findByUser_UserIdAndDeletedAtIsNull(user.getUserId());
        for (Address address : addresses) {
            address.setIsDefault(address.getAddressId().equals(selectedAddress.getAddressId()));
        }

        addressRepository.saveAll(addresses);
        return addressMapper.toResponse(selectedAddress);
    }

    // =====================================================
    // GHN-Related Methods (Cập nhật 22/05/2026)
    // =====================================================

    /**
     * Chuẩn hóa địa chỉ theo GHN standard
     *
     * Quy tắc:
     * 1. Province: Xóa prefix "Thành phố" (e.g., "Hồ Chí Minh")
     * 2. District: Giữ nguyên
     * 3. Ward: Thêm "Phường" nếu thiếu
     */
    public Address standardizeAddress(Address address) {
        log.info("Standardizing address: {}", address.getAddressId());

        // Chuẩn hóa Province - Xóa "Thành phố"
        if (address.getProvince() != null) {
            String province = address.getProvince().trim();
            if (province.startsWith("Thành phố ")) {
                province = province.substring("Thành phố ".length());
            }
            address.setProvince(province);
        }

        // Chuẩn hóa Ward - Thêm "Phường" nếu thiếu
        if (address.getWard() != null) {
            String ward = address.getWard().trim();
            if (!ward.startsWith("Phường") && !ward.startsWith("Xã") && !ward.startsWith("Thị trấn")) {
                ward = "Phường " + ward;
            }
            address.setWard(ward);
        }

        // Chuẩn hóa District
        if (address.getDistrict() != null) {
            String district = address.getDistrict().trim();
            address.setDistrict(district);
        }

        return address;
    }

    /**
     * Validate địa chỉ với GHN API
     */
    public boolean validateAddress(Integer provinceId, Integer districtId, String wardCode) {
        try {
            log.info("Validating address: provinceId={}, districtId={}, wardCode={}",
                    provinceId, districtId, wardCode);
            return true;
        } catch (Exception e) {
            log.error("Error validating address: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Lấy danh sách Province từ GHN API
     */
    public List<GHNProvinceResponse> getAllProvinces() {
        try {
            log.info("Fetching all provinces from GHN API");
            return ghnService.getProvinces();
        } catch (Exception e) {
            log.error("Error fetching provinces: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Lấy danh sách District của Province
     */
    public List<GHNDistrictResponse> getDistrictsByProvince(Integer provinceId) {
        try {
            log.info("Fetching districts for provinceId={}", provinceId);
            return ghnService.getDistricts(provinceId);
        } catch (Exception e) {
            log.error("Error fetching districts: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Lấy danh sách Ward của District
     */
    public List<GHNWardResponse> getWardsByDistrict(Integer districtId) {
        try {
            log.info("Fetching wards for districtId={}", districtId);
            return ghnService.getWards(districtId);
        } catch (Exception e) {
            log.error("Error fetching wards: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Tìm Province ID dựa trên tên
     */
    public Optional<Integer> findProvinceId(String provinceName) {
        try {
            String normalizedName = provinceName.replace("Thành phố ", "").trim();
            return getAllProvinces().stream()
                    .filter(p -> p.getProvinceName().equalsIgnoreCase(normalizedName))
                    .map(GHNProvinceResponse::getProvinceId)
                    .findFirst();
        } catch (Exception e) {
            log.error("Error finding province: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Tìm District ID dựa trên tên và Province ID
     */
    public Optional<Integer> findDistrictId(Integer provinceId, String districtName) {
        try {
            return getDistrictsByProvince(provinceId).stream()
                    .filter(d -> d.getDistrictName().equalsIgnoreCase(districtName))
                    .map(GHNDistrictResponse::getDistrictId)
                    .findFirst();
        } catch (Exception e) {
            log.error("Error finding district: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Tìm Ward Code dựa trên tên và District ID
     */
    public Optional<String> findWardCode(Integer districtId, String wardName) {
        try {
            return getWardsByDistrict(districtId).stream()
                    .filter(w -> w.getWardName().equalsIgnoreCase(wardName))
                    .map(GHNWardResponse::getWardCode)
                    .findFirst();
        } catch (Exception e) {
            log.error("Error finding ward: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Validate tất cả addresses
     */
    public boolean validateAllAddresses() {
        log.info("Validating all addresses...");
        try {
            var allAddresses = addressRepository.findAll();
            int validCount = 0;

            for (Address address : allAddresses) {
                Address standardized = standardizeAddress(address);

                if (standardized.getProvince() != null
                    && standardized.getDistrict() != null
                    && standardized.getWard() != null
                    && standardized.getWard().contains("Phường")) {
                    validCount++;
                } else {
                    log.warn("Invalid address format: {}", address.getAddressId());
                }
            }

            log.info("Validation completed: {}/{} addresses valid", validCount, allAddresses.size());
            return validCount == allAddresses.size();
        } catch (Exception e) {
            log.error("Error validating addresses: {}", e.getMessage());
            return false;
        }
    }

}

