package com.crcs.resourceservice.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<RoleAuthorizationConfig> roleAuthorizationFilter(RoleAuthorizationConfig filter) {
        FilterRegistrationBean<RoleAuthorizationConfig> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/resources/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}
