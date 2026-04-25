package com.hoang.hot_desking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class RedisConfig {

    //Cấu hình RedisConnectionFactory, lấy thông tin từ file application.yml
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    //StringRedisTemplate giúp thao tác với Key-Value dạng String dễ dàng
    @Bean
    public StringRedisTemplate redisTemplate(RedisConnectionFactory factory){
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(factory);
        return template;
    }
}
