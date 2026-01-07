import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeApiResponse } from "../utils/normalizeApiResponse";
import { api } from "../utils/app";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useLandingData = () => {
  const [data, setData] = useState({
    hero: null,
    about: null,
    whatWeDo: null,
    solution: null,
    business: null,
    services: null,
    product: null,
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const requests = {
        hero: api.get(`${API_URL}/banners`),
        about: api.get(`${API_URL}/about`),
        whatWeDo: api.get(`${API_URL}/what-we-all`),
        solution: api.get(`${API_URL}/our-solution-all`),
        business: api.get(`${API_URL}/business-verticals`),
        services: api.get(`${API_URL}/services`),
        product: api.get(`${API_URL}/show-products`),
      };

      const results = await Promise.allSettled(
        Object.entries(requests).map(([key, req]) =>
          req.then((res) => ({
            key,
            data: normalizeApiResponse(key, res),
          }))
        )
      );

      const newData = {};
      const newErrors = {};

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          newData[result.value.key] = result.value.data;
        } else {
          newErrors[result.reason?.config?.url || "unknown"] = true;
        }
      });

      setData((prev) => ({ ...prev, ...newData }));
      setErrors(newErrors);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return { data, loading, errors };
};
