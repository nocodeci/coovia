-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mfa_tokens_updated_at BEFORE UPDATE ON public.mfa_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_login_attempts_updated_at BEFORE UPDATE ON public.login_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number(store_id_param BIGINT)
RETURNS TEXT AS $$
DECLARE
    order_count INTEGER;
    order_number TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO order_count
    FROM public.orders
    WHERE store_id = store_id_param;

    order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(order_count::TEXT, 4, '0');

    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' AND OLD.customer_id IS NOT NULL THEN
        UPDATE public.customers
        SET
            total_spent = (
                SELECT COALESCE(SUM(total_amount), 0)
                FROM public.orders
                WHERE customer_id = OLD.customer_id AND financial_status = 'paid'
            ),
            orders_count = (
                SELECT COUNT(*)
                FROM public.orders
                WHERE customer_id = OLD.customer_id
            ),
            last_order_date = (
                SELECT MAX(created_at)
                FROM public.orders
                WHERE customer_id = OLD.customer_id
            )
        WHERE id = OLD.customer_id;

    ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.customer_id IS NOT NULL THEN
        UPDATE public.customers
        SET
            total_spent = (
                SELECT COALESCE(SUM(total_amount), 0)
                FROM public.orders
                WHERE customer_id = NEW.customer_id AND financial_status = 'paid'
            ),
            orders_count = (
                SELECT COUNT(*)
                FROM public.orders
                WHERE customer_id = NEW.customer_id
            ),
            last_order_date = (
                SELECT MAX(created_at)
                FROM public.orders
                WHERE customer_id = NEW.customer_id
            )
        WHERE id = NEW.customer_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ✅ Corrigé : Trigger sans clause WHEN
CREATE TRIGGER update_customer_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- Function to clean expired MFA tokens
CREATE OR REPLACE FUNCTION clean_expired_mfa_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.mfa_tokens
    WHERE expires_at < NOW() - INTERVAL '1 day';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old login attempts
CREATE OR REPLACE FUNCTION clean_old_login_attempts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.login_attempts
    WHERE created_at < NOW() - INTERVAL '30 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
