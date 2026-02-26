// Cloudflare Pages middleware — password gate
// Change PASSWORD to whatever shared password you want
const PASSWORD = "eql1ght";
const COOKIE_NAME = "eq_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getLoginPage(error) {
  const errorHtml = error
    ? `<p style="color:#C23934;font-size:0.8125rem;margin-bottom:1rem;">Incorrect password. Please try again.</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EQ Lightning — Sign In</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .gate {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,.1);
      padding: 2.5rem 2rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .gate-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .gate-logo svg { height: 24px; }
    .gate-logo span {
      font-size: 1.125rem;
      font-weight: 800;
      color: #032D60;
      letter-spacing: .03em;
    }
    .gate-sub {
      font-size: 0.8125rem;
      color: #706E6B;
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: #3E3E3C;
      margin-bottom: 0.25rem;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid #DDDBDA;
      border-radius: 4px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    input[type="password"]:focus {
      outline: none;
      border-color: #0070D2;
      box-shadow: 0 0 0 1px #0070D2;
    }
    button {
      width: 100%;
      padding: 0.625rem;
      background: #0070D2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { background: #005FB2; }
    .gate-footer {
      margin-top: 1.5rem;
      font-size: 0.6875rem;
      color: #706E6B;
    }
  </style>
</head>
<body>
  <div class="gate">
    <div class="gate-logo">
      <svg height="24" viewBox="0 0 92 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.8839 0L36.7208 3.21551V51.3797L30.5665 49.2588V5.33638L12.2403 11.7674V42.8278L6.15433 40.707V13.8883L0 16.0091V45.0171L18.3262 51.4481V16.0775L24.4806 13.9567V53.569L42.8068 60V7.52566L45.8839 6.49943L48.9611 7.52566V60L67.2873 53.569V13.9567L73.4417 16.0775V51.4481L91.7679 45.0171V16.0091L85.6819 13.8883V40.707L79.5276 42.8278V11.7674L61.2014 5.33638V49.2588L55.047 51.3797V3.21551L45.8839 0Z" fill="#032D60"/>
      </svg>
      <span>EQ Lightning</span>
    </div>
    <p class="gate-sub">Salesforce Lightning Design System Prototype</p>
    ${errorHtml}
    <form method="POST">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Enter access password" autofocus required>
      <button type="submit">Sign In</button>
    </form>
    <p class="gate-footer">Equinix UX &middot; Internal use only</p>
  </div>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Allow static assets through without auth (CSS, JS, SVGs, images)
  const ext = url.pathname.split(".").pop().toLowerCase();
  const passthrough = ["css", "js", "svg", "png", "jpg", "ico", "woff", "woff2", "ttf"];
  if (passthrough.includes(ext)) {
    return context.next();
  }

  // Check for auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const hasAuth = cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=valid`));

  if (hasAuth) {
    return context.next();
  }

  // Handle POST (password submission)
  if (request.method === "POST") {
    const formData = await request.formData();
    const submitted = formData.get("password");

    if (submitted === PASSWORD) {
      // Set cookie and redirect to requested page
      const response = new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname || "/",
          "Set-Cookie": `${COOKIE_NAME}=valid; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        },
      });
      return response;
    }

    // Wrong password — show form with error
    return new Response(getLoginPage(true), {
      status: 401,
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  }

  // No auth — show login page
  return new Response(getLoginPage(false), {
    status: 401,
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
