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
        
        // Calculate free trial until April 30, 2026
        const freeUntilDate = new Date('2026-04-30T23:59:59Z');
        const now = new Date();
        const daysUntilCharge = Math.ceil((freeUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        const sessionConfig = {
            payment_method_types: ['card'],
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
        };

        // Add trial period if before April 30, 2026
        if (daysUntilCharge > 0) {
            sessionConfig.subscription_data = {
                trial_period_days: daysUntilCharge,
            };
        }
        
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create(sessionConfig);

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});