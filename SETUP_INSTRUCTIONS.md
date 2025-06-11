# Quick Setup to Fix Chat Input

## The Issue
The chat input box isn't working because we need to set up API keys.

## Quick Fix

### 1. Create .env.local file
In your project root, create a file called `.env.local`:

```bash
# Add at least one of these API keys
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key-here
```

### 2. Get API Keys (Choose One)

**Option A: OpenAI (Recommended)**
1. Go to https://platform.openai.com/api-keys
2. Create an account / sign in
3. Click "Create new secret key"
4. Copy the key to `.env.local`

**Option B: Anthropic Claude**
1. Go to https://console.anthropic.com/
2. Sign up / sign in
3. Go to API Keys section
4. Generate a key and copy to `.env.local`

### 3. Restart Development Server
```bash
npm run dev
```

### 4. Test Chat Input
1. Go to http://localhost:3000
2. Click "Start AI Chat"
3. Try typing in the input box - it should work now!

## Expected Behavior
- ✅ Input box should accept text
- ✅ Send button should become active when typing
- ✅ Messages should send and get AI responses
- ✅ Chat should work smoothly

## If Still Not Working
1. Check browser console for errors (F12)
2. Verify API key is correct in `.env.local`
3. Make sure you restarted the development server

The chat input should now be fully functional! 