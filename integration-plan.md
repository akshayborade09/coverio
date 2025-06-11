# CoverIO + Zola Integration Plan

## Overview
Integrate your cover letter app with Zola's chat framework to create a comprehensive AI-powered cover letter generation platform.

## Phase 1: Setup Integration

### 1. Copy Zola Dependencies
```bash
# From Zola's package.json, add these to your current project:
npm install @ai-sdk/anthropic @ai-sdk/google @ai-sdk/mistral @ai-sdk/openai
npm install @tanstack/react-query class-variance-authority clsx
npm install ai next-themes zustand @supabase/supabase-js
npm install @radix-ui/react-tooltip @radix-ui/react-sonner
```

### 2. Merge Layout Providers
```typescript
// app/layout.tsx - Enhanced version
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getUserProfile() // From Zola

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={openSauceOne.variable}>
        <TanstackQueryProvider>
          <UserProvider initialUser={userProfile}>
            <ModelProvider>
              <ChatsProvider userId={userProfile?.id}>
                <ChatSessionProvider>
                  <MessagesProvider>
                    <UserPreferencesProvider userId={userProfile?.id}>
                      <TooltipProvider>
                        <ThemeProvider attribute="class" defaultTheme="dark">
                          <SidebarProvider>
                            <Toaster position="top-center" />
                            {children}
                          </SidebarProvider>
                        </ThemeProvider>
                      </TooltipProvider>
                    </UserPreferencesProvider>
                  </MessagesProvider>
                </ChatSessionProvider>
              </ChatsProvider>
            </ModelProvider>
          </UserProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
```

## Phase 2: Create Unified Navigation

### Enhanced Bottom Navigation
```typescript
// components/BottomNavigation.tsx - Updated
interface NavigationItem {
  id: string
  label: string
  icon: string
  href: string
  requiresChat?: boolean
}

const navigationItems: NavigationItem[] = [
  { id: 'chat', label: 'Chat', icon: 'home', href: '/' },
  { id: 'cover-letter', label: 'Cover Letter', icon: 'cover-letter', href: '/cover-letter' },
  { id: 'my-space', label: 'My Space', icon: 'my-space', href: '/my-space' },
]
```

## Phase 3: Chat Integration Routes

### 1. Main Chat (/)
- General AI chat with all models
- Cover letter generation prompts
- File upload for resumes/job descriptions

### 2. Cover Letter Chat (/cover-letter/chat)
- Specialized for cover letter creation
- Context-aware prompts
- Direct integration with editor

### 3. Cover Letter Editor (/cover-letter)
- Your existing editor
- Enhanced with AI suggestions
- Save to Zola's storage system

## Phase 4: Specialized Prompts

### Cover Letter System Prompts
```typescript
export const coverLetterPrompts = {
  system: `You are a professional cover letter writing assistant. 
  Help users create compelling, personalized cover letters that highlight 
  relevant experience and match job requirements.`,
  
  initial: `I'll help you create a professional cover letter. Please:
  1. Share the job description or key requirements
  2. Upload your resume (optional)
  3. Tell me about the company and role`,
  
  followUp: `Would you like me to:
  - Adjust the tone or style
  - Highlight specific skills
  - Modify any sections
  - Generate different versions`,
}
```

## Phase 5: Data Flow Integration

### Chat → Editor Flow
```typescript
// When user creates cover letter in chat
const generateCoverLetter = async (prompt: string) => {
  const response = await ai.generate(prompt)
  
  // Parse response into sections
  const sections = parseCoverLetterSections(response)
  
  // Navigate to editor with pre-filled content
  router.push('/cover-letter', { 
    state: { 
      generatedContent: sections,
      fromChat: true 
    }
  })
}
```

### Editor → Storage Integration
```typescript
// Save cover letters to Zola's storage system
const saveCoverLetter = async (content: CoverLetterContent) => {
  await supabase
    .from('cover_letters')
    .insert({
      user_id: user.id,
      title: content.title,
      content: content,
      created_at: new Date()
    })
}
```

## Phase 6: Enhanced Features

### 1. Multi-Model Support
- Let users choose their preferred AI model
- OpenAI for creativity, Claude for analysis, etc.

### 2. File Upload Integration
- Resume parsing with Zola's file upload
- Job description analysis
- Company research integration

### 3. Template Management
- Save successful cover letters as templates
- Industry-specific templates
- Role-specific customizations

## Phase 7: Migration Strategy

### Option A: Full Migration
1. Start fresh with Zola as base
2. Import your components into Zola structure
3. Maintain your design system

### Option B: Selective Integration
1. Keep your current app structure
2. Add Zola's chat providers and API routes
3. Integrate chat components where needed

### Option C: Hybrid Approach (Recommended)
1. Use Zola for main chat and AI features
2. Keep your specialized editor as-is
3. Create seamless navigation between both

## Implementation Priority

### Week 1: Foundation
- [ ] Set up Zola providers in your app
- [ ] Create unified layout with both navigation systems
- [ ] Test basic chat functionality

### Week 2: Integration
- [ ] Implement cover letter specific chat prompts
- [ ] Create data flow from chat to editor
- [ ] Integrate file upload for resumes

### Week 3: Enhancement
- [ ] Add multi-model selection
- [ ] Implement storage for generated cover letters
- [ ] Create template system

### Week 4: Polish
- [ ] Optimize user experience flow
- [ ] Add export options (PDF, etc.)
- [ ] Implement sharing and collaboration features

## Benefits of This Integration

1. **Professional Chat Interface**: Users get a modern AI chat experience
2. **Specialized Editing**: Your detailed editor for fine-tuning
3. **Multi-Model Support**: Choice of AI providers
4. **File Handling**: Resume and job description uploads
5. **Storage & History**: Save and retrieve previous cover letters
6. **Authentication**: User accounts and data persistence

## Next Steps

Would you like me to:
1. Start implementing the layout integration?
2. Create the specialized chat prompts?
3. Set up the data flow between chat and editor?
4. Show you specific code examples for any component? 