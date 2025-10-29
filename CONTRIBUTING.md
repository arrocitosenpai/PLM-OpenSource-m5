# Contributing to PLM OpenSource

First off — thank you for being interested in improving PLM OpenSource 💜  
Even small fixes help a lot!

---

## 🪄 How you can contribute

### 🐛 Report bugs
- Go to [Issues](https://github.com/arrocitosenpai/PLM-OpenSource-m5/issues)
- Include:
  - What you expected
  - What actually happened
  - Steps to reproduce
  - Screenshots if relevant

### 💡 Suggest improvements
- Open an Issue before starting any big feature PR.
- Explain the problem or use case clearly.
- Keep in mind: this repo focuses on the **community edition**.
  (Multi-tenant, billing, analytics, and compliance features belong to the SaaS version.)

### 🔧 Submit a Pull Request
- Fork the repo
- Create a new branch (`fix/bug-name` or `feat/feature-name`)
- Run the app locally (`npm run dev`)
- Test your changes
- Submit the PR with a short description

### 🧹 Code style
- Keep your code readable and simple
- Don’t include any API keys, credentials, or internal URLs
- If you add a new environment variable, update `.env.example` too
- Lint before submitting (`npm run lint`)

---

## 🧭 What belongs here
- Intake → Product → Engineering → Platform flow
- Document generation helpers (PDD/SDD)
- Local single-tenant usage
- Jira integration scaffolding
- Small UX fixes and documentation

## 🚫 What does **not** belong here
- Multi-tenant / organizations / RBAC
- Billing / usage limits
- Compliance dashboards (SOX, GxP)
- Private AI models / prompts

Those live in the **private SaaS version**.

---

Thank you again for helping improve the open-source core ❤️  
Together we can make product lifecycle management less painful for everyone.
