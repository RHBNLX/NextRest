import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

type UserRole = 'admin' | 'courier' | 'customer' | null;

/**
 * Hook to protect routes based on user role
 * Usage: useProtectedRoute('admin') - only allows admin users
 */
export function useProtectedRoute(allowedRoles: UserRole[]) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // If no one is logged in
    if (!isLoggedIn || !user) {
      Alert.alert(
        'Hozzáférés megtagadva',
        'Kérlek jelentkezz be az oldal megtekintéséhez.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
      router.replace('/auth/login');
      return;
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(user.role as UserRole)) {
      Alert.alert(
        'Hozzáférés megtagadva',
        'Nincs jogosultságod ennek az oldalnak a megtekintéséhez.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
      router.replace('/');
      return;
    }
  }, [isLoggedIn, user, allowedRoles, router]);
}
