package com.crcs.common.enums;

import org.apache.commons.lang3.StringUtils;

/**
 * User Role Enum for CRCS Platform
 * Defines the different user types and their permissions
 */
public enum UserRole {
    /**
     * Regular campus user - can book resources
     */
    USER("USER", "Regular campus user"),

    /**
     * Resource Manager - can manage resources (rooms, labs, equipment)
     */
    RESOURCE_MANAGER("RESOURCE_MANAGER", "Manages campus resources"),

    /**
     * Facility Manager - can manage facilities and approve bookings
     */
    FACILITY_MANAGER("FACILITY_MANAGER", "Manages facilities"),

    /**
     * System Administrator - full access to all features
     */
    ADMIN("ADMIN", "System administrator");

    private final String value;
    private final String description;

    UserRole(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Convert string to UserRole enum
     */
    public static UserRole fromString(String role) {
        if (StringUtils.isBlank(role)) {
            return USER; // Default role
        }
        
        for (UserRole userRole : UserRole.values()) {
            if (StringUtils.equalsIgnoreCase(userRole.value, role) || 
                StringUtils.equalsIgnoreCase(userRole.name(), role)) {
                return userRole;
            }
        }
        
        throw new IllegalArgumentException(StringUtils.join("Invalid user role: ", role));
    }

    /**
     * Check if role is valid
     */
    public static boolean isValid(String role) {
        if (StringUtils.isBlank(role)) {
            return false;
        }
        
        for (UserRole userRole : UserRole.values()) {
            if (StringUtils.equalsIgnoreCase(userRole.value, role) || 
                StringUtils.equalsIgnoreCase(userRole.name(), role)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if user has admin privileges
     */
    public boolean isAdmin() {
        return this == ADMIN;
    }

    /**
     * Check if user can manage resources
     */
    public boolean canManageResources() {
        return this == ADMIN || this == RESOURCE_MANAGER || this == FACILITY_MANAGER;
    }

    /**
     * Check if user can approve bookings
     */
    public boolean canApproveBookings() {
        return this == ADMIN || this == FACILITY_MANAGER;
    }
}
