import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// POST /api/gates/verify - Trigger IoT gate verification
export async function POST(request: Request) {
    try {
        const { student_id } = await request.json();
        
        // Path to the gate verification script
        const scriptPath = path.join(process.cwd(), '..', 'gate_verification.py');
        
        console.log(`[IoT] Starting verification script: ${scriptPath}`);
        
        // Spawn the Python process in headless mode (no display)
        const pythonProcess = spawn('python3', [scriptPath, '--headless'], {
            cwd: path.join(process.cwd(), '..'),
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, 'HEADLESS': '1' }
        });

        let output = '';
        let error = '';

        // Capture stdout
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
            console.log(`[IoT] ${data.toString().trim()}`);
        });

        // Capture stderr
        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error(`[IoT Error] ${data.toString().trim()}`);
        });

        // Process completion
        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(new Error(`Process exited with code ${code}: ${error}`));
                }
            });
        });

        // Parse result from output
        let result: { success: boolean; message: string; access?: 'granted' | 'denied' } = {
            success: false,
            message: 'Verification completed'
        };
        
        if (output.includes('ACCESS GRANTED')) {
            result = { success: true, message: 'Access Granted', access: 'granted' };
        } else if (output.includes('ACCESS DENIED')) {
            result = { success: false, message: 'Access Denied', access: 'denied' };
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('IoT verification error:', error);
        return NextResponse.json({ 
            error: error.message || 'Verification failed',
            success: false 
        }, { status: 500 });
    }
}

// GET /api/gates/verify - Get verification status
export async function GET() {
    return NextResponse.json({
        status: 'ready',
        message: 'IoT Gate Verification system is ready',
        features: ['Face Recognition', 'QR Code Scanning', 'Student Pass Verification']
    });
}
