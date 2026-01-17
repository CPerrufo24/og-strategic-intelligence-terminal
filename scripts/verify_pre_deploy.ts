import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Load Environment Variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyDeploymentReadiness() {
    console.log('🚀 Starting Pre-Deployment Verification for Vercel/Netlify...\n');

    // Dynamic import to ensureenv vars are loaded before service initialization
    const { generateStrategicBrief } = await import('../services/geminiService');

    // 1. Check Environment Variables
    console.log('1️⃣  Checking Environment Variables...');
    if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
        console.error('❌ CRITICAL: GEMINI_API_KEY is missing in .env.local');
        process.exit(1);
    }
    console.log('✅ API Key found.\n');

    // 2. Run Unit Tests
    console.log('2️⃣  Running Unit Tests...');
    try {
        execSync('npm test -- --run', { stdio: 'inherit' });
        console.log('✅ Unit Tests Passed.\n');
    } catch (e) {
        console.error('❌ Unit Tests FAILED.');
        process.exit(1);
    }

    // 3. Verify Real AI Connection (Integration Test)
    console.log('3️⃣  Verifying REAL Gemini API Connection (Live Data Check)...');
    console.log('   Using model configured in geminiService.ts...');
    try {
        const start = Date.now();
        const brief = await generateStrategicBrief();
        const duration = Date.now() - start;

        if (!brief || !brief.macro || !brief.pillars) {
            throw new Error('Invalid response structure received from AI.');
        }

        console.log(`✅ AI Connection Successful (${duration}ms)`);
        console.log(`   - Report Date: ${brief.lastUpdated}`);
        console.log(`   - Macro Sentiment: ${brief.macro.sentiment}`);
        console.log(`   - Pillars Generated: ${brief.pillars.length}`);
        console.log('   - Real Data: CONFIRMED.\n');

    } catch (error: any) {
        console.error('❌ Real AI Call FAILED.');
        console.error('   Error Details:', error.message);
        console.error('   Recommendation: Check your API Key permissions and Model ID in geminiService.ts.');
        process.exit(1);
    }

    // 4. Verify Production Build
    console.log('4️⃣  Verifying Production Build (TypeScript/Vite)...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Build Successful.\n');
    } catch (e) {
        console.error('❌ Build FAILED. Fix TypeScript errors before deploying.');
        process.exit(1);
    }

    console.log('🎉 ALL SYSTEMS GO! Your application is ready for deployment.');
}

verifyDeploymentReadiness();
