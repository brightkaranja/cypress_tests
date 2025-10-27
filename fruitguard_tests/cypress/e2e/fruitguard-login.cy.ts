describe("FruitGuard Login Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.visit("https://fruitguard-mocha.vercel.app/Login");
  });

  it("renders login UI correctly", () => {
    cy.contains("h1", "Log In").should("be.visible");
    cy.contains("h2", "FruitGuard").should("be.visible");

    cy.get('input[placeholder="Enter email"]').should("be.visible");
    cy.get('input[placeholder="Enter password"]').should("be.visible");

    cy.contains("button", "Log In").should("be.visible");

    cy.contains("a", "Sign Up").should("be.visible");
  });

  it("logs in successfully with required working credentials and redirects to farmer registration page", () => {
    const email = "marionkamu@gmail.com";
    const password = "12345";

    cy.get('input[placeholder="Enter email"]').type(email);
    cy.get('input[placeholder="Enter password"]').type(password);

    cy.contains("button", "Log In").click();
    cy.wait("@loginRequest");

    cy.url().should("include", "/farmer-registration");
  });

  it("shows error toast for invalid credentials", () => {
    cy.get('input[placeholder="Enter email"]').type("wrong@example.com");
    cy.get('input[placeholder="Enter password"]').type("wrongpass");

    cy.contains("button", "Log In").click();
    cy.wait("@loginRequest");

    cy.contains(/invalid|incorrect/i);
    cy.url().should("include", "/Login");
  });

  it("prevents submission with empty fields", () => {
    cy.contains("button", "Log In").click();
    cy.url().should("include", "/Login");
  });

  it("navigates to Register page", () => {
    cy.contains("a", "Sign Up").click();
    cy.url().should("include", "/Register");
  });

  it("navigates to Forgot Password page", () => {
    cy.contains("a", "Forgot Password?").click();
    cy.url().should("include", "/ForgotPassword");
  });
});

