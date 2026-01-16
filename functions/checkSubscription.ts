import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Checking subscription for user:', user.email);

        // Search for customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
        });

        if (customers.data.length === 0) {
            console.log('No Stripe customer found for:', user.email);
            return Response.json({ 
                subscription_status: 'free',
                message: 'No subscription found'
            });
        }

        const customer = customers.data[0];
        console.log('Found customer:', customer.id);

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 10
        });

        console.log('Subscriptions:', subscriptions.data.map(s => ({ id: s.id, status: s.status })));

        // Check if any active subscription exists
        const activeSubscription = subscriptions.data.find(sub => 
            ['active', 'trialing'].includes(sub.status)
        );

        const newStatus = activeSubscription ? 'premium' : 'free';
        
        // Update user status if needed
        if (user.subscription_status !== newStatus) {
            await base44.asServiceRole.entities.User.update(user.id, {
                subscription_status: newStatus,
                stripe_customer_id: customer.id
            });
            console.log(`✅ Updated user ${user.email} to ${newStatus}`);
        }

        return Response.json({ 
            subscription_status: newStatus,
            customer_id: customer.id,
            active_subscription: activeSubscription ? {
                id: activeSubscription.id,
                status: activeSubscription.status
            } : null
        });
    } catch (error) {
        console.error('Check subscription error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});