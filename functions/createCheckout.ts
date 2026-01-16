import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const priceId = Deno.env.get("STRIPE_PRICE_ID");

        const baseUrl = 'https://www.rosierides.com';
        
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'apple_pay', 'google_pay'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${baseUrl}/Home?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/Home`,
            customer_email: user.email,
            allow_promotion_codes: true,
            metadata: {
                user_id: user.id,
                user_email: user.email,
            },
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});