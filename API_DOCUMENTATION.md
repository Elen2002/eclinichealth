# EClinic Health - API Documentation

This document provides a comprehensive overview of the functional API endpoints available in the EClinic Health application.

## Authentication

Most API endpoints require authentication using a Bearer token in the `Authorization` header.

**Header Format:**
```http
Authorization: Bearer <your_api_token>
```

---

## 1. Authentication & User Management

### Login
*   **URL:** `/api/login`
*   **Method:** `POST`
*   **Payload:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response:** Returns a user object and an `apiToken`.

### Register
*   **URL:** `/api/register`
*   **Method:** `POST`
*   **Payload:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "firstName": "John",
      "lastName": "Doe"
    }
    ```

### Get User Profile
*   **URL:** `/api/user/profile`
*   **Method:** `GET`
*   **Auth Required:** Yes
*   **Description:** Returns details about the currently authenticated user, including their QR code path.

### Update User Profile
*   **URL:** `/api/user/update`
*   **Method:** `POST`
*   **Auth Required:** Yes
*   **Payload (partial):** `firstName`, `lastName`, `phone`, `email`, `avatar` (base64 string).

---

## 2. Hospitals, Departments & Doctors

### List Hospitals
*   **URL:** `/api/hospitals`
*   **Method:** `GET`

### Hospital Details
*   **URL:** `/api/hospitals/{id}`
*   **Method:** `GET`

### List Doctors in Hospital
*   **URL:** `/api/hospitals/{id}/doctors`
*   **Method:** `GET`

### List Departments
*   **URL:** `/api/departments`
*   **Method:** `GET`

### Department Details
*   **URL:** `/api/departments/{id}`
*   **Method:** `GET`

### List Doctors in Department
*   **URL:** `/api/departments/{id}/doctors`
*   **Method:** `GET`

### List All Doctors
*   **URL:** `/api/doctors`
*   **Method:** `GET`

---

## 3. Consultations

### Create Consultation Request
*   **URL:** `/api/consultation`
*   **Method:** `POST`
*   **Payload:**
    ```json
    {
      "name": "Patient Name",
      "phone": "+123456789",
      "hospital_id": 1,
      "department_id": 1,
      "doctor_id": 1,
      "date": "2024-05-10 10:00",
      "message": "Reason for visit"
    }
    ```

### Get Doctor Consultations
*   **URL:** `/api/doctor/consultations`
*   **Method:** `GET`
*   **Auth Required:** Yes (Doctor role)

### Get User Consultations
*   **URL:** `/api/user/consultations`
*   **Method:** `GET`
*   **Auth Required:** Yes

---

## 4. Chat & Communications

### Get Recent Communications
*   **URL:** `/api/chat/recent-communications`
*   **Method:** `GET`
*   **Auth Required:** Yes
*   **Description:** Returns a list of users the current user has chatted with.

### Get Chat Messages by Room
*   **URL:** `/api/chat/rooms/{roomId}/messages`
*   **Method:** `GET`

### Send Message to Room
*   **URL:** `/api/chat/rooms/{roomId}/messages`
*   **Method:** `POST`
*   **Payload:** `{"text": "Hello"}`

### Get Chat History (Room ID)
*   **URL:** `/api/chat/history/{roomId}`
*   **Method:** `GET`

### Save Chat Message (Legacy/Generic)
*   **URL:** `/api/chat/save`
*   **Method:** `POST`
*   **Payload:** `{"text": "...", "roomId": "...", "targetId": "..."}`

---

## 5. Notifications

### Unread Notification Count
*   **URL:** `/api/notifications/unread-count`
*   **Method:** `GET`
*   **Auth Required:** Yes

### List Unread Notifications
*   **URL:** `/api/notifications/unread`
*   **Method:** `GET`
*   **Auth Required:** Yes

### List All Notifications
*   **URL:** `/api/notifications`
*   **Method:** `GET`
*   **Auth Required:** Yes

### Mark Notification as Read
*   **URL:** `/api/notifications/{id}/read`
*   **Method:** `POST`
*   **Auth Required:** Yes

### Mark All Notifications as Read
*   **URL:** `/api/notifications/mark-all-read`
*   **Method:** `POST`
*   **Auth Required:** Yes

---

## 6. Doctor Specific Endpoints

### Get Doctor Stats
*   **URL:** `/api/doctor/stats`
*   **Method:** `GET`
*   **Auth Required:** Yes (Doctor)

### Get Doctor Patients
*   **URL:** `/api/doctor/patients`
*   **Method:** `GET`
*   **Auth Required:** Yes (Doctor)

### Doctor Check-in (Scan Patient QR)
*   **URL:** `/api/doctor/check-in`
*   **Method:** `POST`
*   **Payload:** `{"qr_content": "..."}`

---

## 7. AI & Misc

### AI Symptom Analysis
*   **URL:** `/api/ai/analyze`
*   **Method:** `POST`
*   **Payload:** `{"symptoms": "I have a headache and fever"}`

### Home Page Data
*   **URL:** `/api/home`
*   **Method:** `GET`
*   **Description:** Aggregated data for the mobile app home screen (hospitals, departments, charts).

### Push Notification Test
*   **URL:** `/api/test/push`
*   **Method:** `POST`
