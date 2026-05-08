export function isAuthorizedCronRequest(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return false;

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 && token === secret;
}
