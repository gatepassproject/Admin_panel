
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gatepass-gatepass-backend.hf.space';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_V1_URL || `${BACKEND_URL}/api/v1`;

export const API_ENDPOINTS = {
    STATS: `${API_BASE_URL}/stats`,
    VIDEOS: `${API_BASE_URL}/videos`,
    PROCESS_PASS: `${API_BASE_URL}/process-pass`,
    VERIFY_FACE: `${API_BASE_URL}/verify-face`,
    SEND_NOTIFICATION: `${API_BASE_URL}/send-notification`,
    BULK_INVITE: `${API_BASE_URL}/process-bulk-invite`,
    VALIDATE_INVITE: `${API_BASE_URL}/validate-invite`,
};
