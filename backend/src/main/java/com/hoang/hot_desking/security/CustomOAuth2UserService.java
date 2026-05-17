package com.hoang.hot_desking.security;

import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.UserRole;
import com.hoang.hot_desking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        //lấy thông tin thô từ Google
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String sub = oAuth2User.getAttribute("sub"); //googleId

        log.info("Bắt đầu xử lý dữ liệu từ Google cho Email: {}", email);

        userRepository.findByEmail(email)
                .ifPresentOrElse(
                        user -> {
                            user.setFullName(name);
                            user.setPictureUrl(picture);
                            user.setGoogleId(sub);
                            userRepository.save(user);
                        },
                        () -> {
                            User newUser = User.builder()
                                    .email(email)
                                    .fullName(name)
                                    .pictureUrl(picture)
                                    .googleId(sub)
                                    .role(UserRole.EMPLOYEE)
                                    .enabled(true)
                                    .build();
                            userRepository.save(newUser);
                        }
                );
        return oAuth2User;
    }
}
