# 📌 API Endpoints Documentation

This document outlines the API endpoints for the **Keys of Gabriel** web application.

---

## **📅 Booking Endpoints**
### 1️⃣ **Fetch Available Booking Times**
- **URL:** `/api/bookings/available-times`
- **Method:** `GET`
- **Query Parameters:**  
  - `date` (string) – Date for which available times are requested
- **Response:**
```json
{
  "success": true,
  "times": ["10:00", "12:00", "15:00"]
}