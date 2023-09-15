"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import Modal from "./Modal";
import Button from "./Button";
import { Price, ProductWithPrices } from "../../types_incl_stripe";
import useUserContext from "@/hooks/useUserContext";
import { callApiFromClientSide } from "@/libsForStripe/helpers";
import { getStripeClientForClientSide } from "@/libsForStripe/getStripePromiseFromClient";

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

interface SubscribeModalProps {
  products: ProductWithPrices[];
}

const SubscribeModal = ({ products }: SubscribeModalProps) => {
  const subscribeModal = useSubscribeModal();
  const {
    user,
    isLoading: isloadingUserContext,
    subscription,
  } = useUserContext();
  const [isloadingPrice, setIsloadingPrice] = useState(false);

  const handleCheckout = async (price: Price) => {
    setIsloadingPrice(true);
    if (!user) {
      setIsloadingPrice(false);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      setIsloadingPrice(false);
      return toast("Already subscribed");
    }

    try {
      const { sessionId } = await callApiFromClientSide({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripeClientForClientSide = await getStripeClientForClientSide();
      stripeClientForClientSide?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setIsloadingPrice(false);
    }
  };

  let content = <div className="text-center">No products available.</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length)
            return <div key={product.id}>No prices available</div>;
          else
            return product.prices.map((price) => (
              <Button
                key={price.id}
                onClick={() => handleCheckout(price)}
                disabled={isloadingUserContext || isloadingPrice}
                className="my-4"
                autoFocus
              >
                {`Subscribe for ${formatPrice(price)} per ${price.interval}`}
              </Button>
            ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed.</div>;
  }

  return (
    <Modal
      title="Subscribe to plan: Play Music"
      description="Music is only playable for subscribed users"
      isOpen={subscribeModal.isOpen}
      onClose={subscribeModal.closeModal}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
