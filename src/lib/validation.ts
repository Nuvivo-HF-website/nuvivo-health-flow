// Security validation utilities for input sanitization and validation

export class ValidationUtils {
  // Email validation with stricter security
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Phone number validation (UK format)
  static isValidUKPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    return ukPhoneRegex.test(cleanPhone);
  }

  // Postcode validation (UK format)
  static isValidUKPostcode(postcode: string): boolean {
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/;
    return postcodeRegex.test(cleanPostcode);
  }

  // NHS Number validation (basic format check)
  static isValidNHSNumber(nhsNumber: string): boolean {
    const cleanNHS = nhsNumber.replace(/\s+/g, '');
    return /^\d{10}$/.test(cleanNHS);
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Sanitize medical text (allows more characters but still secure)
  static sanitizeMedicalText(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 5000); // Limit length for medical text
  }

  // Validate name (allows letters, spaces, hyphens, apostrophes)
  static isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
    return nameRegex.test(name);
  }

  // Validate date (must be in the past for date of birth)
  static isValidDateOfBirth(date: string): boolean {
    const inputDate = new Date(date);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    
    return inputDate <= today && inputDate >= minDate;
  }

  // Validate address
  static isValidAddress(address: string): boolean {
    // Allow alphanumeric, spaces, commas, periods, hyphens
    const addressRegex = /^[a-zA-Z0-9\s,.\-]{1,100}$/;
    return addressRegex.test(address);
  }

  // Rate limiting check (simple in-memory implementation)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Validate consultation booking data
  static validateConsultationBooking(data: {
    consultationType: string;
    date: Date;
    time: string;
    notes?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check consultation type
    const validTypes = ['mental-health', 'nutrition', 'second-opinion', 'sexual-health'];
    if (!validTypes.includes(data.consultationType)) {
      errors.push('Invalid consultation type');
    }

    // Check date (must be in the future)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.push('Appointment date must be in the future');
    }

    // Check time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.time)) {
      errors.push('Invalid time format');
    }

    // Validate notes if provided
    if (data.notes && data.notes.length > 1000) {
      errors.push('Notes must be less than 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate patient profile data
  static validatePatientProfile(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    if (!data.first_name || !this.isValidName(data.first_name)) {
      errors.push('Valid first name is required');
    }

    if (!data.last_name || !this.isValidName(data.last_name)) {
      errors.push('Valid last name is required');
    }

    // Validate date of birth
    if (!data.date_of_birth || !this.isValidDateOfBirth(data.date_of_birth)) {
      errors.push('Valid date of birth is required');
    }

    // Validate phone if provided
    if (data.phone && !this.isValidUKPhone(data.phone)) {
      errors.push('Valid UK phone number is required');
    }

    // Validate postcode if provided
    if (data.postcode && !this.isValidUKPostcode(data.postcode)) {
      errors.push('Valid UK postcode is required');
    }

    // Validate addresses
    if (data.address_line_1 && !this.isValidAddress(data.address_line_1)) {
      errors.push('Valid address line 1 is required');
    }

    if (data.address_line_2 && !this.isValidAddress(data.address_line_2)) {
      errors.push('Invalid address line 2 format');
    }

    // Validate emergency contact
    if (data.emergency_contact_phone && !this.isValidUKPhone(data.emergency_contact_phone)) {
      errors.push('Valid emergency contact phone is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}