export function LandingIntegrations() {
  return (
    <section className="w-full py-16 px-4 bg-background transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-foreground">Integrations</h2>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {/* GitHub */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Docker */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
            alt="Docker"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Unity */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg"
            alt="Unity"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* AWS */}
          <img
            src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
            alt="AWS"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* GitLab */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg"
            alt="GitLab"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Jenkins */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
            alt="Jenkins"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Unreal */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg"
            alt="Unreal Engine"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Google */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
          {/* Dropbox (PNG fallback) */}
          <img
            src="https://cfl.dropboxstatic.com/static/images/brand/glyph@2x.png"
            alt="Dropbox"
            className="h-14 w-auto grayscale hover:grayscale-0 transition duration-200 rounded p-2 shadow"
            style={{ maxWidth: 120 }}
          />
        </div>
      </div>
    </section>
  );
} 