import { isLoggedIn, tokenValido } from "~/services/tokenService";

export default defineNuxtRouteMiddleware((to, from) => {
    
    const router = useRouter();
    const matchedRoute = router.resolve(to.path);
    
    const loggedIn = isLoggedIn();
    const tokenOK = tokenValido();
    
    if (matchedRoute.matched.length === 0) {
        return navigateTo('/login');
    }
    
    if (to.path === '/login') {
        if (loggedIn || tokenOK) {
            return navigateTo("/pedidos");
        }
    }
    
    if (process.client) {
        if (!loggedIn || !tokenOK) {
            return navigateTo("/login");
        }
    }
});