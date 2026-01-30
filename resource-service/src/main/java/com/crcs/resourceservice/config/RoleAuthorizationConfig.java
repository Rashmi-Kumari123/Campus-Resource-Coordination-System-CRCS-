package com.crcs.resourceservice.config;

import com.crcs.common.enums.UserRole;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Role-based authorization filter for resource management endpoints
 * Checks if user has permission to manage resources
 */
@Component
public class RoleAuthorizationConfig extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Check if this is a management endpoint
        if (path.contains("/resources/manage") || 
            request.getMethod().equals("POST") || 
            request.getMethod().equals("PUT") || 
            request.getMethod().equals("DELETE")) {
            
            String userRole = request.getHeader("X-User-Role");
            
            if (userRole == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            
            try {
                UserRole role = UserRole.fromString(userRole);
                
                // Only allow resource managers, facility managers, and admins
                if (!role.canManageResources()) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Insufficient permissions to manage resources");
                    return;
                }
            } catch (IllegalArgumentException e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
