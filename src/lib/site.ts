export const site = {
    githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "",
    githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "",
    linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "",
    email: process.env.NEXT_PUBLIC_EMAIL || "",
};

export const hasGitHub = Boolean(site.githubUsername && site.githubUrl);
export const hasLinkedIn = Boolean(site.linkedinUrl);
export const hasResume = Boolean(site.resumeUrl);
export const hasEmail = Boolean(site.email);
