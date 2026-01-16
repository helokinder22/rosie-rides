import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        // Handle successful checkout
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userEmail = session.customer_email || session.metadata?.user_email;
            const customerId = session.customer;

            console.log('🔔 Checkout completed for:', userEmail, 'Customer ID:', customerId);
            console.log('Session mode:', session.mode);
            console.log('Session subscription:', session.subscription);
            console.log('Full session data:', JSON.stringify(session, null, 2));

            if (userEmail) {
                const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
                
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: 'premium',
                        stripe_customer_id: customerId
                    });
                    console.log(`✅ Successfully updated user ${userEmail} to premium with customer ID ${customerId}`);
                } else {
                    console.error(`❌ No user found with email ${userEmail}`);
                }
            } else {
                console.error('❌ No user email found in checkout session');
            }
        }

        // Handle subscription creation (for promo codes and free trials)
        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            
            console.log('🔔 Subscription created for customer:', customerId);
            console.log('Subscription status:', subscription.status);
            
            const customer = await stripe.customers.retrieve(customerId);
            const userEmail = customer.email;

            if (userEmail) {
                const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
                
                if (users.length > 0) {
                    // Activate for active, trialing, or any active subscription status
                    if (['active', 'trialing'].includes(subscription.status)) {
                        await base44.asServiceRole.entities.User.update(users[0].id, {
                            subscription_status: 'premium',
                            stripe_customer_id: customerId
                        });
                        console.log(`✅ Activated premium for ${userEmail} (status: ${subscription.status})`);
                    }
                } else {
                    console.error(`❌ No user found with email ${userEmail}`);
                }
            }
        }

        // Handle subscription updates
        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const customer = await stripe.customers.retrieve(subscription.customer);
            const userEmail = customer.email;

            if (userEmail) {
                const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
                
                if (users.length > 0) {
                    const status = subscription.status === 'active' ? 'premium' : 'free';
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: status,
                        stripe_customer_id: subscription.customer
                    });
                    console.log(`Updated user ${userEmail} to ${status}`);
                }
            }
        }

        // Handle subscription cancellation
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customer = await stripe.customers.retrieve(subscription.customer);
            const userEmail = customer.email;

            if (userEmail) {
                const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
                
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: 'free'
                    });
                    console.log(`Downgraded user ${userEmail} to free`);
                }
            }
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ error: error.message }, { status: 400 });
    }
});