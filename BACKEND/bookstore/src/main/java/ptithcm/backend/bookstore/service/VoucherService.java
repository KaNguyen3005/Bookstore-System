package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateVoucherRequest;
import ptithcm.backend.bookstore.dto.request.UpdateVoucherRequest;
import ptithcm.backend.bookstore.dto.response.VoucherResponse;
import ptithcm.backend.bookstore.entity.Voucher;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.VoucherMapper;
import ptithcm.backend.bookstore.repository.VoucherRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class VoucherService {
    VoucherRepository voucherRepository;
    VoucherMapper voucherMapper;

    @Transactional
    public VoucherResponse create(CreateVoucherRequest request){
        // Kiểm tra voucher code đã tồn tại chưa
        if (voucherRepository.findByVoucherCode(request.getVoucherCode()).isPresent()) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_EXISTS);
        }

        Voucher voucher = voucherMapper.toEntity(request);
        voucher.setUsedCount(0);
        
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    public VoucherResponse getById(Long id){
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        
        return voucherMapper.toResponse(voucher);
    }

    public List<VoucherResponse> getAll(){
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<VoucherResponse> getAllActive(){
        return voucherRepository.findByIsActiveTrue().stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    public VoucherResponse getByCode(String voucherCode){
        Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        
        return voucherMapper.toResponse(voucher);
    }

    @Transactional
    public VoucherResponse update(Long id, UpdateVoucherRequest request){
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        if (request.getTitle() != null) {
            voucher.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            voucher.setDescription(request.getDescription());
        }

        if (request.getType() != null) {
            voucher.setType(request.getType());
        }

        if (request.getDiscountValue() != null) {
            voucher.setDiscountValue(request.getDiscountValue());
        }

        if (request.getMaxDiscountAmount() != null) {
            voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        }

        if (request.getMinOrderValue() != null) {
            voucher.setMinOrderValue(request.getMinOrderValue());
        }

        if (request.getTotalLimit() != null) {
            voucher.setTotalLimit(request.getTotalLimit());
        }

        if (request.getLimitPerUser() != null) {
            voucher.setLimitPerUser(request.getLimitPerUser());
        }

        if (request.getMinPoint() != null) {
            voucher.setMinPoint(request.getMinPoint());
        }

        if (request.getStartDate() != null) {
            voucher.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            voucher.setEndDate(request.getEndDate());
        }

        if (request.getIsActive() != null) {
            voucher.setIsActive(request.getIsActive());
        }

        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    @Transactional
    public void delete(Long id){
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        voucher.setDeletedAt(LocalDateTime.now());
    }
}

