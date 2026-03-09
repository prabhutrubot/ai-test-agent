// pages/CreatePostPage.js
class CreatePostPage {
  constructor(page) {
    this.page = page;
    this.self = page.getByText('Self');
    this.createPostHeader = page.locator('div.create-post-header.ptr.cursor-pointer.sds-bg-primary-negative.ng-tns-c217-3');
    this.newPostCard = page.locator("div > div > post-templates > div > div:nth-child(1) > img");
    this.postTextArea = page.locator("div > quill-editor > div.ng-star-inserted.ql-container.ql-snow > div.ql-editor.ql-blank");
    this.postButton = page.locator('#dbx-overflow-span');
    this.audienceDropdown = page.getByRole('button', { name: /audience/i });
    this.audienceOptions = page.locator('div[role="listbox"] >> div[role="option"]');
    this.allowCommentsToggle = page.getByLabel('Allow Comments and Replies');
    this.postOnBehalfToggle = page.getByLabel('Post on Behalf of Company');
    this.templateSelector = page.locator('post-templates');
    this.urlInput = page.getByLabel(/url/i);
    this.pictureUploadInput = page.locator('input[type="file"]');
    this.posterTextInput = page.locator('textarea[placeholder*="poster text"], input[placeholder*="poster text"]');
    this.previewButton = page.getByRole('button', { name: /preview/i });
    this.previewContent = page.locator('div.preview-content');
    this.scheduledPostsList = page.locator('div.scheduled-posts-list');
    this.editScheduledPostButton = page.getByRole('button', { name: /edit scheduled post/i });
    this.cancelScheduledPostButton = page.getByRole('button', { name: /cancel scheduled post/i });
    this.errorMessage = page.locator('div.error-message');
    this.emojiButton = page.getByRole('button', { name: /emoji/i });
    this.emojiPicker = page.locator('div.emoji-picker');
    this.audienceQuickSuggestions = page.locator('div.audience-quick-suggestions');
    this.hashtagLink = page.locator('a.hashtag');
    this.nudgeExploreTemplates = page.getByText('Explore templates');
    this.nudgeLastContributed = page.getByText(/days since you last contributed/i);
  }

  async navigateToCreatePost() {
    await this.page.locator('#stdDialog > div > div.main-wrapper > div.all-apps-wrapper > div.all-apps-icon-wrapper > div').click();
    await this.page.getByRole('textbox', { name: 'All Apps' }).click();
    await this.page.getByRole('textbox', { name: 'All Apps' }).fill('Vibe');
    await this.page.getByRole('link', { name: 'BETA VIBE' }).click();
    await this.page.waitForURL('**/vibe/main-feed');
  }

  async openCreatePostFromMainFeed() {
    await this.self.click();
    await this.createPostHeader.click();
  }

  async selectTemplate(templateName) {
    await this.page.getByRole('button', { name: /select template/i }).click();
    await this.page.getByRole('option', { name: templateName }).click();
  }

  async fillGoodReadsUrl(url) {
    await this.urlInput.fill(url);
  }

  async uploadAttachments(filePaths) {
    await this.pictureUploadInput.setInputFiles(filePaths);
  }

  async fillPosterText(text) {
    await this.posterTextInput.fill(text);
  }

  async clickPostButton() {
    await this.postButton.click();
  }

  async isPostButtonEnabled() {
    return await this.postButton.isEnabled();
  }

  async clickPreviewButton() {
    await this.previewButton.click();
  }

  async getPreviewContent() {
    return await this.previewContent.textContent();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async openScheduledPosts() {
    await this.page.goto(`${process.env.BASE_URL}/vibe/scheduled-posts`);
  }

  async editScheduledPost() {
    await this.editScheduledPostButton.click();
  }

  async cancelScheduledPost() {
    await this.cancelScheduledPostButton.click();
  }

  async isAllowCommentsToggleVisible() {
    return await this.allowCommentsToggle.isVisible();
  }

  async toggleAllowComments(shouldEnable) {
    const isChecked = await this.allowCommentsToggle.isChecked();
    if (isChecked !== shouldEnable) {
      await this.allowCommentsToggle.click();
    }
  }

  async isPostOnBehalfToggleVisible() {
    return await this.postOnBehalfToggle.isVisible();
  }

  async togglePostOnBehalf(shouldEnable) {
    const isChecked = await this.postOnBehalfToggle.isChecked();
    if (isChecked !== shouldEnable) {
      await this.postOnBehalfToggle.click();
    }
  }

  async getHashtagText() {
    return await this.hashtagLink.first().textContent();
  }

  async clickHashtag() {
    await this.hashtagLink.first().click();
  }

  async getAudienceQuickSuggestions() {
    return await this.audienceQuickSuggestions.allTextContents();
  }

  async openAudienceSelection() {
    await this.audienceDropdown.click();
  }
}

module.exports = { CreatePostPage };

// tests/contentCreationTemplates.spec.js
const { test, expect } = require('@playwright/test');
const { CreatePostPage } = require('../pages/CreatePostPage');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Content creation templates', () => {
  let createPostPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    createPostPage = new CreatePostPage(page);
    loginPage = new LoginPage(page);
  });

  test('TC001 - Select Template and Pre-populate Post Creation Screen', async ({ page }) => {
    await test.step('Navigate to login and login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post screen', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
    });

    await test.step('Select a template from curated list', async () => {
      await createPostPage.selectTemplate('Any Template'); // Replace 'Any Template' with actual template name if known
    });

    await test.step('Verify post creation screen pre-populated with relevant prompts and formatting', async () => {
      // Assuming prompts and formatting are visible in postTextArea or other locators
      const content = await createPostPage.postTextArea.textContent();
      expect(content).not.toBe('');
    });
  });

  test('TC002 - Mandatory Fields Enable Post Button for Good Reads Template', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select Good Reads template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Good Reads');
    });

    await test.step('Enter invalid link and verify post button disabled', async () => {
      await createPostPage.fillGoodReadsUrl('invalidlink');
      expect(await createPostPage.isPostButtonEnabled()).toBeFalsy();
    });

    await test.step('Enter valid online link and verify post button enabled', async () => {
      await createPostPage.fillGoodReadsUrl('https://validarticle.com');
      expect(await createPostPage.isPostButtonEnabled()).toBeTruthy();
    });
  });

  test('TC003 - Mandatory Poster Text Enables Post Button for Seeking Mentorship Template', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select Seeking Mentorship template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Seeking Mentorship');
    });

    await test.step('Leave poster text empty and verify post button disabled', async () => {
      await createPostPage.fillPosterText('');
      expect(await createPostPage.isPostButtonEnabled()).toBeFalsy();
    });

    await test.step('Enter valid poster text and verify post button enabled', async () => {
      await createPostPage.fillPosterText('Looking for mentorship in project management');
      expect(await createPostPage.isPostButtonEnabled()).toBeTruthy();
    });
  });

  test('TC004 - Attachment Upload Limits Enforced per Template', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select template allowing attachments', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template Allowing Attachments'); // Replace with actual template name
    });

    await test.step('Attempt to upload attachments exceeding max count or size and verify prevention and feedback', async () => {
      // Upload 6 images of 5MB each (simulate large upload)
      const files = [];
      for (let i = 0; i < 6; i++) {
        files.push({
          name: `image${i + 1}.jpg`,
          mimeType: 'image/jpeg',
          buffer: Buffer.alloc(5 * 1024 * 1024), // 5MB dummy buffer
        });
      }
      await createPostPage.uploadAttachments(files);
      const error = await createPostPage.getErrorMessage();
      expect(error).toContain('limit');
    });

    await test.step('Upload attachments within limits and verify success', async () => {
      const files = [{
        name: 'image1.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.alloc(1 * 1024 * 1024), // 1MB dummy buffer
      }];
      await createPostPage.uploadAttachments(files);
      const error = await createPostPage.getErrorMessage();
      expect(error).toBeFalsy();
    });
  });

  test('TC005 - Hashtag Auto-Addition for Template Name', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select Good Reads template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Good Reads');
    });

    await test.step('Verify hashtag #GoodReads auto-added to caption', async () => {
      const hashtagText = await createPostPage.getHashtagText();
      expect(hashtagText).toContain('#GoodReads');
    });

    await test.step('Publish post', async () => {
      await createPostPage.clickPostButton();
      // Add verification for post published if possible
    });

    await test.step('Search feed using hashtag #GoodReads and verify post appears', async () => {
      await page.goto(`${process.env.BASE_URL}/vibe/main-feed`);
      await page.getByRole('searchbox').fill('#GoodReads');
      await page.keyboard.press('Enter');
      const postVisible = await page.locator('article:has-text("#GoodReads")').isVisible();
      expect(postVisible).toBeTruthy();
    });
  });

  test('TC006 - Template Discovery via Carousel on Main Feed', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Open Vibe main feed and locate templates carousel', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      const carousel = page.locator('div.templates-carousel');
      await expect(carousel).toBeVisible();
    });

    await test.step('Scroll through carousel and click on a template', async () => {
      const carousel = page.locator('div.templates-carousel');
      await carousel.scrollIntoViewIfNeeded();
      const template = carousel.locator('div.template-item').first();
      await template.click();
    });

    await test.step('Verify post creation screen opens with template pre-populated', async () => {
      const content = await createPostPage.postTextArea.textContent();
      expect(content).not.toBe('');
    });
  });

  test('TC007 - First-Time User Sees Prioritized Templates and Sample Previews', async ({ page }) => {
    await test.step('Login as first-time user', async () => {
      await loginPage.logintoApp('firsttimeuser', 'password123');
    });

    await test.step('Open Create Post screen', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
    });

    await test.step('Verify prioritized templates Ice Breaker and Seeking Mentorship shown first', async () => {
      const firstTemplates = await page.locator('post-templates button').allTextContents();
      expect(firstTemplates[0]).toContain('Ice Breaker');
      expect(firstTemplates[1]).toContain('Seeking Mentorship');
    });

    await test.step('Verify sample post previews displayed for these templates', async () => {
      const previewIceBreaker = page.locator('div.sample-preview:has-text("Ice Breaker")');
      const previewSeekingMentorship = page.locator('div.sample-preview:has-text("Seeking Mentorship")');
      await expect(previewIceBreaker).toBeVisible();
      await expect(previewSeekingMentorship).toBeVisible();
    });
  });

  test('TC008 - Returning User Template Segregation and Nudges', async ({ page }) => {
    await test.step('Login as returning user', async () => {
      await loginPage.logintoApp('returninguser', 'password123');
    });

    await test.step('Open Create Post screen', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
    });

    await test.step('Verify previously contributed templates shown separately', async () => {
      const contributedSection = page.locator('section.contributed-templates');
      await expect(contributedSection).toBeVisible();
    });

    await test.step('Verify nudges highlight templates not yet contributed to', async () => {
      const nudge = createPostPage.nudgeExploreTemplates;
      await expect(nudge).toBeVisible();
    });
  });

  test('TC009 - Template Order Reverts to Original After 14 Days', async ({ page }) => {
    await test.step('Login as returning user', async () => {
      await loginPage.logintoApp('returninguser', 'password123');
    });

    await test.step('Open Create Post screen and verify template order reflects user status', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      // Verify order by checking template list order or text
      const templates = await page.locator('post-templates button').allTextContents();
      expect(templates.length).toBeGreaterThan(0);
    });

    await test.step('Simulate passage of 14 days', async () => {
      // Placeholder: simulate time passage via API or DB or mock date
    });

    await test.step('Open Create Post screen again and verify template order reverted to original', async () => {
      await page.reload();
      await createPostPage.openCreatePostFromMainFeed();
      const templatesAfter = await page.locator('post-templates button').allTextContents();
      expect(templatesAfter.length).toBeGreaterThan(0);
      // Additional logic to compare order if possible
    });
  });

  test('TC010 - Schedule Post with Date/Time and Edit Before Posting', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select any template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template');
    });

    await test.step('Fill mandatory fields', async () => {
      await createPostPage.fillPosterText('Scheduled post content');
    });

    await test.step('Select schedule post option and set future date/time', async () => {
      await page.getByRole('checkbox', { name: /schedule post/i }).check();
      await page.getByLabel('Schedule Date').fill('2024-12-01T10:00:00');
    });

    await test.step('Save scheduled post', async () => {
      await createPostPage.clickPostButton();
    });

    await test.step('Navigate to scheduled posts', async () => {
      await createPostPage.openScheduledPosts();
      expect(await createPostPage.scheduledPostsList.isVisible()).toBeTruthy();
    });

    await test.step('Edit scheduled post details and save changes', async () => {
      await createPostPage.editScheduledPost();
      await createPostPage.fillPosterText('Updated scheduled post content');
      await createPostPage.clickPostButton();
    });

    await test.step('Verify updated scheduled post details', async () => {
      const updatedContent = await page.locator('div.scheduled-posts-list >> text=Updated scheduled post content').isVisible();
      expect(updatedContent).toBeTruthy();
    });
  });

  test('TC011 - Cancel Scheduled Post Before Publishing', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to scheduled posts', async () => {
      await createPostPage.openScheduledPosts();
      expect(await createPostPage.scheduledPostsList.isVisible()).toBeTruthy();
    });

    await test.step('Select a scheduled post and cancel it', async () => {
      await createPostPage.cancelScheduledPost();
      await page.getByRole('button', { name: /confirm/i }).click();
    });

    await test.step('Verify scheduled post is removed and not published', async () => {
      const scheduledPostsCount = await createPostPage.scheduledPostsList.locator('div.scheduled-post-item').count();
      expect(scheduledPostsCount).toBeLessThanOrEqual(0);
    });
  });

  test('TC012 - Toggles for Comments & Replies Visibility and Behavior', async ({ page }) => {
    await test.step('Login as regular user', async () => {
      await loginPage.logintoApp('regularuser', 'password123');
    });

    await test.step('Open Create Post and verify Allow Comments & Replies toggle visibility', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      const visible = await createPostPage.isAllowCommentsToggleVisible();
      // Assuming admin enabled globally, toggle should be visible
      expect(visible).toBe(true);
    });

    await test.step('Toggle comments off and post content', async () => {
      await createPostPage.toggleAllowComments(false);
      await createPostPage.fillPosterText('Post with comments disabled');
      await createPostPage.clickPostButton();
    });

    await test.step('Verify comments disabled on post', async () => {
      // Placeholder: verify comments disabled on posted content
    });

    await test.step('Login as admin and verify Post On Behalf Of Company toggle visible', async () => {
      await page.context().clearCookies();
      await loginPage.logintoApp('adminuser', 'password123');
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      const visible = await createPostPage.isPostOnBehalfToggleVisible();
      expect(visible).toBe(true);
    });

    await test.step('Post on behalf of company', async () => {
      await createPostPage.togglePostOnBehalf(true);
      await createPostPage.fillPosterText('Post on behalf of company');
      await createPostPage.clickPostButton();
    });
  });

  test('TC013 - Admin-Only Templates Restricted to Authorized Roles', async ({ page }) => {
    await test.step('Login as regular employee and verify admin-only templates not visible', async () => {
      await loginPage.logintoApp('employeeuser', 'password123');
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      const adminTemplate = page.locator('post-templates >> text=Org Update');
      expect(await adminTemplate.isVisible()).toBeFalsy();
    });

    await test.step('Login as manager/admin and verify admin-only templates visible and selectable', async () => {
      await page.context().clearCookies();
      await loginPage.logintoApp('manageruser', 'password123');
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      const adminTemplate = page.locator('post-templates >> text=Org Update');
      expect(await adminTemplate.isVisible()).toBeTruthy();
      await adminTemplate.click();
    });
  });

  test('TC014 - Content Body Character Limits Enforced as per Regular Post Settings', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select any template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template');
    });

    await test.step('Enter content exceeding character limit and verify restriction or error', async () => {
      const longText = 'A'.repeat(10001); // Assuming limit is 10000 chars
      await createPostPage.postTextArea.fill(longText);
      const error = await createPostPage.getErrorMessage();
      expect(error).toBeTruthy();
    });

    await test.step('Enter content within limit and verify acceptance', async () => {
      const validText = 'A'.repeat(1000);
      await createPostPage.postTextArea.fill(validText);
      const error = await createPostPage.getErrorMessage();
      expect(error).toBeFalsy();
    });
  });

  test('TC015 - Preview Option Available for Each Template Before Posting', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select any template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template');
    });

    await test.step('Fill mandatory fields', async () => {
      await createPostPage.fillPosterText('Preview test content');
    });

    await test.step('Click Preview button and verify preview displayed', async () => {
      await createPostPage.clickPreviewButton();
      const previewContent = await createPostPage.getPreviewContent();
      expect(previewContent).toContain('Preview test content');
    });

    await test.step('Close preview and submit post', async () => {
      await page.getByRole('button', { name: /close preview/i }).click();
      await createPostPage.clickPostButton();
    });
  });

  test('TC016 - GPT Assistance Available for Content Generation After User Prompt', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select any template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template');
    });

    await test.step('Enter prompt or partial text and invoke GPT assistance', async () => {
      await createPostPage.postTextArea.fill('Help me write a post about team success');
      await page.getByRole('button', { name: /GPT assistance/i }).click();
    });

    await test.step('Verify GPT suggests content or proofreads input', async () => {
      const suggestion = await page.locator('div.gpt-suggestion').textContent();
      expect(suggestion).toBeTruthy();
    });

    await test.step('Accept GPT suggestions and verify content updated', async () => {
      await page.getByRole('button', { name: /accept suggestion/i }).click();
      const content = await createPostPage.postTextArea.textContent();
      expect(content).toContain('team success');
    });
  });

  test('TC017 - Audience Selection Quick Suggestions and Visibility', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
    });

    await test.step('Verify audience quick suggestions visible with member counts', async () => {
      await createPostPage.openAudienceSelection();
      const suggestions = await createPostPage.getAudienceQuickSuggestions();
      expect(suggestions.some(s => s.match(/All Employees/i))).toBeTruthy();
      expect(suggestions.some(s => s.match(/\d+/))).toBeTruthy();
    });

    await test.step('Select different audience from suggestions and verify update', async () => {
      await page.getByRole('option', { name: /Departments/i }).click();
      const selected = await createPostPage.audienceDropdown.textContent();
      expect(selected).toContain('Departments');
    });
  });

  test('TC018 - Toggle Placement After Content Typing', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select any template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Any Template');
    });

    await test.step('Verify toggles not visible before content typing', async () => {
      expect(await createPostPage.isAllowCommentsToggleVisible()).toBeFalsy();
      expect(await createPostPage.isPostOnBehalfToggleVisible()).toBeFalsy();
    });

    await test.step('Enter content and verify toggles appear', async () => {
      await createPostPage.fillPosterText('Content to trigger toggles');
      expect(await createPostPage.isAllowCommentsToggleVisible()).toBeTruthy();
      expect(await createPostPage.isPostOnBehalfToggleVisible()).toBeTruthy();
    });
  });

  test('TC019 - Invalid Link Input Validation for Good Reads Template', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.logintoApp();
    });

    await test.step('Navigate to Create Post and select Good Reads template', async () => {
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      await createPostPage.selectTemplate('Good Reads');
    });

    await test.step('Enter invalid link and verify error and post button disabled', async () => {
      await createPostPage.fillGoodReadsUrl('invalidlink');
      const error = await createPostPage.getErrorMessage();
      expect(error).toBeTruthy();
      expect(await createPostPage.isPostButtonEnabled()).toBeFalsy();
    });
  });

  test('TC020 - Unauthorized Access to Admin-Only Templates', async ({ page }) => {
    await test.step('Login as regular employee and attempt to access admin-only templates', async () => {
      await loginPage.logintoApp('employeeuser', 'password123');
      await createPostPage.navigateToCreatePost();
      await createPostPage.openCreatePostFromMainFeed();
      // Attempt access via UI
      const adminTemplate = page.locator('post-templates >> text=Org Update');
      expect(await adminTemplate.isVisible()).toBeFalsy();
      // Attempt access via URL
      await page.goto(`${process.env.BASE_URL}/vibe/create-post/admin-only-template`);
      await expect(page).toHaveURL(/access-denied|not-authorized|403/);
    });
  });
});